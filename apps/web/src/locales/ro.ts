import type { PageKey } from "../i18n";
import type { Strings } from "./es";

export const name = "Română";

export const slugs: Record<PageKey, string> = {
  uses: "pentru-cine",
  worksheets: "fise",
  convert: "converteste",
  privacy: "confidentialitate",
  accessibility: "accesibilitate",
};

export const strings: Strings = {
  meta: {
    description:
      "Ajutor de citire liber și gratuit pentru persoanele cu ADHD și dislexie: evidențiază începutul fiecărui cuvânt pe web și în cărțile tale electronice. Totul rămâne pe dispozitivul tău.",
  },
  nav: {
    skip: "Salt la conținut",
    home: "Acasă",
    convert: "Convertește o carte",
    privacy: "Confidențialitate",
    accessibility: "Accesibilitate",
    github: "Cod sursă",
    language: "Limbă",
    theme: {
      label: "Temă",
      light: "luminoasă",
      dark: "întunecată",
    },
  },
  hero: {
    headline: "Citește în felul tău",
    lede: "Evidențiază discret începutul fiecărui cuvânt, ca ochii să aibă unde să se oprească. Pentru persoanele cu ADHD, dislexie sau pentru oricine se simte mai confortabil așa. Gratuit, fără conturi, și nimic nu iese vreodată de pe dispozitivul tău.",
  },
  install: {
    chrome: "Adaugă în Chrome sau Edge",
    firefox: "Adaugă în Firefox",
    preview:
      "Încă nu e în magazine. Până atunci, poți instala versiunea de previzualizare de pe GitHub.",
  },
  demo: {
    heading: "Încearcă cu propriul tău text",
    intro:
      "Lipește orice text. Rezultatul se actualizează pe loc și nu există nicio limită de lungime.",
    input: "Textul tău",
    output: "Cum se citește",
    sample:
      "Cititul ar trebui să fie confortabil. Unele persoane pierd rândul, sar peste cuvinte sau obosesc înainte de finalul unui paragraf. Marcarea începutului fiecărui cuvânt le oferă ochilor un punct de sprijin: încearcă intensități și stiluri diferite până îl găsești pe al tău.",
    strength: "Intensitate",
    style: "Stil",
    styles: {
      "bold-fade": "Aldin și estompat",
      bold: "Aldin",
      color: "Culoare",
      underline: "Subliniere",
      fade: "Estompează restul",
    },
    more: "Mai multe opțiuni",
    every: "Evidențiază",
    everyOptions: ["Toate cuvintele", "1 din 2 cuvinte", "1 din 3 cuvinte"],
    lineHeight: "Spațiere între rânduri",
    maxWidth: "Lățimea maximă a rândului",
    pageDefault: "Normal",
    widths: ["Îngust (50 de caractere)", "Mediu (65 de caractere)", "Lat (80 de caractere)"],
  },
  privacy: {
    heading: "Nimic nu iese de pe dispozitivul tău",
    body: [
      "Extensia, această pagină și convertorul de cărți funcționează în întregime în browserul tău. Nu există niciun server căruia să i se trimită ceva.",
      "Fără conturi, fără statistici, fără cookie-uri și fără limite de utilizare.",
    ],
    more: "Citește politica de confidențialitate",
  },
  faq: {
    heading: "Întrebări",
    items: [
      {
        q: "Chiar funcționează?",
        a: [
          "Depinde de persoană. Studiile publicate până acum nu arată că, în medie, oamenii citesc mai repede sau înțeleg mai mult cu acest tip de evidențiere.",
          "Ce spun însă multe persoane este că cititul devine mai confortabil, că pierd mai rar rândul sau că le e mai ușor să înceapă. De aceea nu promitem viteză: oferim un ajutor pe care îl poți regla sau opri. Încearcă demonstrația și păstrează ce te ajută.",
        ],
      },
      {
        q: "Costă ceva?",
        a: [
          "Nu și nu va costa niciodată. Fără variantă cu plată, fără limită de cuvinte, fără limită de mărime a fișierelor. Este software liber, sub licența MPL-2.0.",
        ],
      },
      {
        q: "Îl pot folosi cu cărțile mele electronice?",
        a: [
          "Da. În „Convertește o carte” alegi un fișier EPUB, TXT, Markdown sau HTML și descarci o copie cu evidențiere. Conversia are loc în browserul tău. Cărțile cu DRM nu pot fi convertite.",
        ],
      },
      {
        q: "Funcționează în orice limbă?",
        a: [
          "În toate limbile care despart cuvintele prin spații, inclusiv cele scrise de la dreapta la stânga. Chineza, japoneza, thailandeza și alte scrieri fără spații rămân neschimbate.",
        ],
      },
      {
        q: "Ce se întâmplă dacă folosesc un cititor de ecran?",
        a: ["Textul se citește exact ca înainte: niciun caracter nu este adăugat sau eliminat."],
      },
      {
        q: "Funcționează pe telefon?",
        a: ["Da, cu Firefox pentru Android. O aplicație dedicată va veni mai târziu."],
      },
    ],
  },
  footer: {
    license: "Software liber, sub licența MPL-2.0.",
  },
  uses: {
    title: "Pentru cine este",
    intro:
      "Fiecare persoană citește în felul ei. Iată câteva moduri de a folosi instrumentul, în funcție de cine ești și de ce ai nevoie. Toate au ceva în comun: este un ajutor opțional, pe care îl poți regla sau opri, și nu colectează niciun fel de date.",
    homeHeading: "Pentru cine este",
    how: "Cum îl folosești",
    care: "De reținut",
    cases: [
      {
        id: "education",
        title: "Educație",
        summary:
          "Pentru cadre didactice, școli și familii care vor să adapteze lecturile fără să creeze materiale noi.",
        link: "Idei pentru clasă și acasă",
        lede: "Pentru cadre didactice, profesori de sprijin și familii care vor ca cititul să ceară ceva mai puțin efort, fără să pregătească materiale diferite pentru fiecare elev.",
        steps: [
          "Adaptează materialele pe care le ai deja: convertește lecturi, notițe sau cărți în EPUB, TXT, Markdown sau HTML și împarte-le așa cum sunt.",
          "La clasă, proiectează demonstrația cu textul zilei și încercați împreună intensități și stiluri diferite. Lasă fiecare elev să spună ce i se pare mai confortabil.",
          "Pe calculatoarele școlii, extensia funcționează fără conturi sau înregistrare și nu colectează date despre elevi.",
          "Creează fișe de citire cu litere mari și un chenar prietenos în „Fișe”, apoi tipărește-le sau salvează-le ca PDF.",
          "Acasă, aceeași extensie ajută la teme și la cititul pe web.",
        ],
        notes: [
          "Este un ajutor opțional: pe unii elevi îi ajută, pe alții nu. Lasă fiecare persoană să aleagă și să-l oprească dacă vrea.",
          "Nu înlocuiește sprijinul educațional și nici diagnosticul dificultăților de învățare.",
        ],
      },
      {
        id: "speech-therapy",
        title: "Logopezi și alți specialiști",
        summary:
          "Pentru logopezi, psihologi școlari și consilieri care caută un instrument simplu de încercat în ședințe.",
        link: "Cum îl folosești în ședințe",
        lede: "Pentru logopezi, psihologi școlari, consilieri și alți specialiști care sprijină persoane cu dificultăți de citire.",
        steps: [
          "În ședință, lipește un text în demonstrație și încearcă mai multe setări împreună cu persoana. Notează-o pe cea care i se pare cea mai confortabilă: intensitate, stil, cuvinte evidențiate, spațiere între rânduri.",
          "Pregătește materiale de lucru cu convertorul și oferă-le pe hârtie, pe ecran sau pe un cititor de cărți electronice.",
          "Recomandă extensia pentru acasă, cu setările alese împreună.",
          "Totul funcționează pe dispozitiv: niciun text și nicio dată despre pacienți nu trece printr-un server.",
        ],
        notes: [
          "Nu este un tratament și nici o metodă de intervenție pentru citire. Poate fi un sprijin în cadrul muncii tale.",
          "Studiile nu arată un câștig mediu de viteză sau de înțelegere. Prezintă-l ca pe o chestiune de confort și preferință și evaluează-l de la caz la caz.",
        ],
      },
      {
        id: "adults",
        title: "Adulți",
        summary:
          "Pentru cei care vor să se apuce din nou de citit, dar nu se pot concentra, pierd rândul sau obosesc repede.",
        link: "Cum să începi",
        lede: "Dacă vrei să citești mai mult, dar îți e greu să începi, pierzi rândul, citești aceeași frază de trei ori sau rămâi fără energie de la pagina a doua, s-ar putea să te ajute. Iar dacă nu, nu-i nimic.",
        steps: [
          "Instalează extensia și pornește-o cu Alt+B pe un articol care te interesează. Începe cu texte scurte.",
          "Convertește o carte pe care chiar vrei s-o citești și pune-o pe cititorul de cărți electronice sau pe telefon.",
          "Reglează intensitatea până ți se pare confortabil. La „Mai multe opțiuni” poți mări spațierea dintre rânduri și îngusta rândurile: pentru multe persoane, asta ajută la fel de mult ca evidențierea.",
          "Dacă într-o zi te obosește, oprește-o. Este felul tău de a citi, nu o regulă.",
        ],
        notes: [
          "Nu funcționează pentru toată lumea și nu-i nimic. Acordă-i câteva zile înainte să decizi.",
          "Dacă bănuiești că în spatele dificultăților tale ar putea fi ADHD sau dislexie, o discuție cu un specialist te poate ajuta.",
        ],
      },
    ],
  },
  worksheets: {
    title: "Fișe de citire",
    nav: "Fișe",
    intro:
      "Creează fișe cu litere mari, cu începutul fiecărui cuvânt evidențiat și un chenar prietenos. Alege un text de exemplu sau scrie-l pe al tău, apoi tipărește-l sau descarcă-l.",
    editor: "Personalizează fișa",
    example: "Alege un text",
    titleLabel: "Titlu",
    textLabel: "Text",
    theme: "Chenar",
    themes: {
      none: "Fără chenar",
      simple: "Simplu",
      clouds: "Nori",
      garden: "Grădină",
      stars: "Stele",
      vehicles: "Mașini și camioane",
    },
    size: "Mărimea textului",
    sizes: ["Mare", "Foarte mare", "Uriaș"],
    nameDate: "Adaugă numele și data",
    name: "Nume",
    date: "Data",
    lines: "Rânduri pentru scris",
    linesOptions: ["Niciunul", "3 rânduri", "6 rânduri", "10 rânduri"],
    preview: "Previzualizare",
    showPageSize: "Arată mărimea paginii",
    pageSizes: { portrait: "A4 vertical (210 × 297 mm)", landscape: "A4 orizontal (297 × 210 mm)" },
    pageN: "Pagina {n}",
    editHint:
      "Poți scrie direct pe fișă: dă clic pe titlu sau pe text. Evidențierea se aplică atunci când termini.",
    editTitle: "Titlul fișei",
    editText: "Textul fișei",
    print: "Tipărește sau salvează ca PDF",
    download: "Descarcă fișa",
    printHint:
      "Ca s-o salvezi ca PDF, alege „Salvează ca PDF” în fereastra de tipărire. Se tipărește pe fundal alb, ca să economisești cerneală.",
    downloadHint:
      "Fișierul descărcat este o pagină web pe care o poți deschide și tipări oricând, chiar și fără internet.",
    fileName: "fisa",
    tabs: { text: "Text", layout: "Aranjare", emphasis: "Evidențiere" },
    myTexts: "Textele mele",
    save: "Salvează în textele mele",
    saved: "„{title}” a fost salvat în textele mele.",
    remove: "Scoate din textele mele",
    removed: "„{title}” a fost scos din textele mele.",
    exportTexts: "Exportă textele mele",
    importTexts: "Importă texte",
    imported: "Texte importate: {n}.",
    importEmpty:
      "Fișierul acesta nu conține niciun text. Folosește un fișier .md cu titluri „## ” sau un fișier .txt.",
    libraryNote:
      "Textele tale sunt salvate doar în acest browser. Exportă-le ca să păstrezi o copie, să le împarți cu alții sau să le muți pe alt calculator.",
    exportHeading: "Textele mele pentru fișe",
    levelKey: "Nivel",
    textsFileName: "textele-mele-pentru-fise",
    orientation: "Orientare",
    orientations: { portrait: "Vertical", landscape: "Orizontal" },
    overflow:
      "Fișa trece pe a doua pagină. Ca să încapă pe una singură, scurtează textul, alege o mărime mai mică a textului sau scoate din rânduri.",
  },
  settings: {
    title: "Setări de citire",
    open: "Deschide setările de citire",
    close: "Închide",
    note: "Se aplică demonstrației, fișelor și convertorului și sunt salvate doar în acest browser.",
    presets: "Setările mele salvate",
    empty:
      "Încă nu ai salvat nicio setare. Dă un nume setărilor actuale ca să revii la ele dintr-un clic.",
    name: "Nume",
    placeholder: "De exemplu: Citire în clasă",
    save: "Salvează",
    apply: "Folosește setările „{name}”",
    remove: "Șterge „{name}”",
    saved: "Setările „{name}” au fost salvate.",
    removed: "„{name}” a fost șters.",
    applied: "Acum folosești „{name}”.",
    reset: "Revino la setările implicite",
    restored: "Setările implicite au fost restabilite.",
  },
  convert: {
    title: "Convertește o carte",
    intro:
      "Alege o carte sau un document și descarcă o copie cu evidențiere. Fișierul nu iese niciodată de pe dispozitivul tău: totul se întâmplă în acest browser, fără limită de mărime.",
    pick: "Alege un fișier",
    drop: "sau trage-l aici",
    formats: "EPUB, TXT, Markdown sau HTML",
    selected: "Fișier ales:",
    output: "Formatul rezultatului",
    outputs: { epub: "EPUB (carte electronică)", html: "HTML (pagină web)", md: "Markdown" },
    options: "Cum se evidențiază",
    start: "Convertește",
    progress: "Se convertește: {n} %",
    cancel: "Anulează",
    cancelled: "Conversie anulată. Nu s-a salvat nimic.",
    done: "Gata. Fișierul tău este pregătit.",
    download: "Descarcă {name}",
    errors: {
      unsupported:
        "Formatul acesta nu poate fi convertit. Alege un fișier EPUB, TXT, Markdown sau HTML.",
      drm: "Cartea aceasta are DRM (protecție la copiere), așa că nu poate fi convertită. Dacă ai cumpărat-o, întreabă magazinul dacă îți poate da o copie fără DRM.",
      invalid:
        "Fișierul acesta nu a putut fi citit. Verifică dacă se deschide în cititorul tău sau încearcă altul.",
      failed: "Conversia a eșuat ({detail}). Dacă se mai întâmplă, te rugăm să ne spui pe GitHub.",
    },
    labels: { part: "Partea", contents: "Cuprins" },
    steps: {
      choose: "Alege cartea",
      adjust: "Reglează cum arată",
      convert: "Convertește și descarcă",
    },
    previewTitle: "Cum va începe cartea ta",
    previewEmpty: "Alege un fișier și prima lui pagină va apărea aici, cu evidențiere.",
    previewLoading: "Se pregătește previzualizarea…",
    previewNote:
      "Imagine aproximativă: fiecare cititor afișează cartea cu propriul font și propria mărime a literelor.",
    previewNone: "Nu s-a găsit text la începutul fișierului, dar îl poți converti oricum.",
    change: "Alege alt fișier",
    devices: {
      heading: "Cum o pui pe cititorul tău",
      items: [
        {
          name: "Kindle",
          text: "Folosește Send to Kindle de la Amazon (site, aplicație sau e-mail) și alege fișierul EPUB. Amazon îl adaptează pentru Kindle-ul tău.",
        },
        {
          name: "Kobo",
          text: "Conectează Kobo la calculator cu cablul USB și copiază EPUB-ul pe el. Scoate-l în siguranță și cartea apare în biblioteca ta.",
        },
        {
          name: "PocketBook",
          text: "Copiaz-o prin USB, ca la Kobo, sau trimite-o prin e-mail cu serviciul Send-to-PocketBook.",
        },
      ],
      calibre:
        "Dacă folosești Calibre, adaugă fișierul în bibliotecă și trimite-l la cititor ca pe orice altă carte.",
    },
  },
  pages: {
    privacy: {
      title: "Confidențialitate",
      body: [
        "Nu colectăm date. Niciunele.",
        "Extensia, acest site și convertorul funcționează în întregime pe dispozitivul tău. Ce citești și fișierele pe care le convertești nu sunt trimise nicăieri: nu avem servere.",
        "Nu folosim statistici, cookie-uri, telemetrie și nici fonturi sau scripturi de pe alte site-uri.",
        "Extensia îți salvează setările (intensitate, stil, site-urile pe care o vrei mereu pornită) în spațiul de stocare al propriului tău browser. Dacă sincronizarea browserului este activă, browserul le poate copia între dispozitivele tale; noi nu le vedem niciodată.",
        "Extensia cere doar permisiunile de care are nevoie. Accesul la un anumit site sau la toate site-urile este cerut doar când alegi „Mereu pe acest site” sau „Pe toate site-urile”, iar îl poți retrage oricând.",
      ],
    },
    accessibility: {
      title: "Accesibilitate",
      body: [
        "Evidențierea nu schimbă niciodată ce citește un cititor de ecran: textul este exact același, caracter cu caracter. Verificăm asta cu teste automate și cu NVDA și VoiceOver înainte de fiecare versiune.",
        "Totul funcționează doar cu tastatura. Extensia se pornește și se oprește cu Alt+B, iar scurtătura o poți schimba din setările browserului.",
        "Culorile evidențierii pornesc de la culoarea textului însuși, așa că contrastul se păstrează în modul luminos, în modul întunecat și în tema fiecărui site.",
        "Acest site folosește fontul Atkinson Hyperlegible, creat ca literele să se distingă clar, și respectă preferințele sistemului tău pentru modul întunecat și reducerea animațiilor.",
        "Dacă dai de o barieră, deschide un issue pe GitHub: este o eroare și o vom trata ca atare.",
      ],
    },
  },
};
