import type { PageKey } from "../i18n";
import type { Strings } from "./es";

export const name = "Deutsch";

export const slugs: Record<PageKey, string> = {
  uses: "fuer-wen",
  worksheets: "arbeitsblaetter",
  convert: "umwandeln",
  privacy: "datenschutz",
  accessibility: "barrierefreiheit",
};

export const strings: Strings = {
  meta: {
    description:
      "Freie, kostenlose Lesehilfe für Menschen mit ADHS und Legasthenie: hebt den Anfang jedes Wortes hervor, im Web und in deinen E-Books. Alles bleibt auf deinem Gerät.",
  },
  nav: {
    skip: "Zum Inhalt springen",
    home: "Start",
    convert: "Buch umwandeln",
    privacy: "Datenschutz",
    accessibility: "Barrierefreiheit",
    github: "Quellcode",
    language: "Sprache",
    theme: {
      label: "Design",
      light: "hell",
      dark: "dunkel",
    },
  },
  hero: {
    headline: "Lies auf deine Art",
    lede: "Hebt den Anfang jedes Wortes sanft hervor, damit deine Augen einen Halt finden. Für Menschen mit ADHS, Legasthenie oder alle, denen es so angenehmer ist. Kostenlos, ohne Konto, und nichts verlässt jemals dein Gerät.",
  },
  install: {
    chrome: "Zu Chrome oder Edge hinzufügen",
    firefox: "Zu Firefox hinzufügen",
    preview:
      "Noch nicht in den Stores. Bis dahin kannst du die Vorabversion von GitHub installieren.",
  },
  demo: {
    heading: "Probier es mit deinem eigenen Text",
    intro:
      "Füge einen beliebigen Text ein. Das Ergebnis ändert sich sofort, und es gibt keine Längenbegrenzung.",
    input: "Dein Text",
    output: "So liest er sich",
    sample:
      "Lesen soll sich angenehm anfühlen. Manche Menschen verlieren die Zeile, überspringen Wörter oder werden müde, bevor der Absatz zu Ende ist. Wenn der Anfang jedes Wortes markiert ist, haben die Augen einen Ankerpunkt: Probier verschiedene Stärken und Stile aus, bis du deinen findest.",
    strength: "Stärke",
    style: "Stil",
    styles: {
      "bold-fade": "Fett und blass",
      bold: "Fett",
      color: "Farbe",
      underline: "Unterstrichen",
      fade: "Rest blasser",
    },
    more: "Weitere Optionen",
    every: "Hervorheben",
    everyOptions: ["Jedes Wort", "Jedes 2. Wort", "Jedes 3. Wort"],
    lineHeight: "Zeilenabstand",
    maxWidth: "Maximale Zeilenbreite",
    pageDefault: "Normal",
    widths: ["Schmal (50 Zeichen)", "Mittel (65 Zeichen)", "Breit (80 Zeichen)"],
  },
  privacy: {
    heading: "Nichts verlässt dein Gerät",
    body: [
      "Die Erweiterung, diese Seite und der Buch-Umwandler laufen vollständig in deinem Browser. Es gibt keinen Server, an den etwas gesendet werden könnte.",
      "Keine Konten, keine Analyse, keine Cookies und keine Nutzungsgrenzen.",
    ],
    more: "Datenschutzerklärung lesen",
  },
  faq: {
    heading: "Fragen",
    items: [
      {
        q: "Funktioniert das wirklich?",
        a: [
          "Das kommt auf die Person an. Die bisher veröffentlichten Studien zeigen nicht, dass Menschen mit dieser Art der Hervorhebung im Durchschnitt schneller lesen oder mehr verstehen.",
          "Viele berichten aber, dass sich das Lesen angenehmer anfühlt, dass sie seltener die Zeile verlieren oder leichter ins Lesen hineinfinden. Deshalb versprechen wir keine Geschwindigkeit: Wir bieten eine Hilfe, die du anpassen oder ausschalten kannst. Probier die Demo aus und behalte, was dir hilft.",
        ],
      },
      {
        q: "Kostet es etwas?",
        a: [
          "Nein, und das wird auch so bleiben. Keine Bezahlversion, keine Wortgrenze, keine Dateigrößengrenze. Es ist freie Software unter der Lizenz MPL-2.0.",
        ],
      },
      {
        q: "Kann ich es mit meinen E-Books nutzen?",
        a: [
          "Ja. Unter „Buch umwandeln“ wählst du eine EPUB-, TXT-, Markdown- oder HTML-Datei aus und lädst eine Kopie mit Hervorhebung herunter. Die Umwandlung passiert in deinem Browser. Bücher mit DRM können nicht umgewandelt werden.",
        ],
      },
      {
        q: "Funktioniert es in jeder Sprache?",
        a: [
          "In allen Sprachen, die Wörter mit Leerzeichen trennen, auch in Schriften, die von rechts nach links laufen. Chinesisch, Japanisch, Thai und andere Schriften ohne Leerzeichen bleiben unverändert.",
        ],
      },
      {
        q: "Und wenn ich einen Screenreader nutze?",
        a: [
          "Der Text wird genau wie vorher vorgelesen: Es werden keine Zeichen hinzugefügt oder entfernt.",
        ],
      },
      {
        q: "Funktioniert es auf meinem Handy?",
        a: ["Ja, mit Firefox für Android. Eine eigene App kommt später."],
      },
    ],
  },
  footer: {
    license: "Freie Software unter der Lizenz MPL-2.0.",
  },
  uses: {
    title: "Für wen es ist",
    intro:
      "Alle lesen auf ihre eigene Art. Hier findest du einige Möglichkeiten, das Werkzeug zu nutzen, je nachdem, wer du bist und wofür du es brauchst. Gemeinsam ist allen: Es ist eine freiwillige Hilfe, die du anpassen oder ausschalten kannst, und sie sammelt keine Daten.",
    homeHeading: "Für wen es ist",
    how: "So nutzt du es",
    care: "Gut zu wissen",
    cases: [
      {
        id: "education",
        title: "Schule und Bildung",
        summary:
          "Für Lehrkräfte, Schulen und Familien, die Lesematerial anpassen möchten, ohne neues zu erstellen.",
        link: "Ideen für Unterricht und Zuhause",
        lede: "Für Lehrkräfte, Förderteams und Familien, die möchten, dass Lesen etwas weniger Mühe kostet, ohne für jedes Kind eigenes Material vorzubereiten.",
        steps: [
          "Pass das Material an, das du schon hast: Wandle Lesetexte, Notizen oder Bücher im Format EPUB, TXT, Markdown oder HTML um und teile sie einfach so.",
          "Zeig im Unterricht die Demo mit dem Text des Tages und probiert gemeinsam verschiedene Stärken und Stile aus. Lass jedes Kind sagen, was sich am angenehmsten anfühlt.",
          "Auf Schulcomputern funktioniert die Erweiterung ohne Konten oder Anmeldung und sammelt keine Daten der Schülerinnen und Schüler.",
          "Erstelle unter „Arbeitsblätter“ Leseblätter mit großer Schrift und einem freundlichen Rahmen, und drucke sie aus oder speichere sie als PDF.",
          "Zu Hause hilft dieselbe Erweiterung bei den Hausaufgaben und beim Lesen im Web.",
        ],
        notes: [
          "Es ist eine freiwillige Hilfe: Manchen Kindern hilft sie, anderen nicht. Lass alle selbst wählen und es ausschalten, wenn sie möchten.",
          "Sie ersetzt keine pädagogische Förderung und keine Diagnose von Lernschwierigkeiten.",
        ],
      },
      {
        id: "speech-therapy",
        title: "Logopädie und andere Fachleute",
        summary:
          "Für Logopädinnen und Logopäden, Schulpsychologie und Beratung, die ein einfaches Werkzeug für ihre Sitzungen suchen.",
        link: "So nutzt du es in Sitzungen",
        lede: "Für Logopädinnen und Logopäden, Schulpsychologie, Beratung und andere Fachleute, die Menschen mit Leseschwierigkeiten begleiten.",
        steps: [
          "Füge in einer Sitzung einen Text in die Demo ein und probiert gemeinsam mehrere Einstellungen aus. Notiere, was sich am angenehmsten anfühlt: Stärke, Stil, hervorgehobene Wörter, Zeilenabstand.",
          "Bereite mit dem Umwandler Arbeitsmaterial vor und gib es auf Papier, am Bildschirm oder auf einem E-Reader weiter.",
          "Empfiehl die Erweiterung für zu Hause, mit den Einstellungen, die ihr gemeinsam ausgewählt habt.",
          "Alles läuft auf dem Gerät: Texte oder Daten von Klientinnen und Klienten gehen nie über einen Server.",
        ],
        notes: [
          "Es ist keine Therapie und keine Methode der Leseförderung. Es kann eine Unterstützung innerhalb deiner Arbeit sein.",
          "Studien zeigen im Durchschnitt keinen Gewinn an Geschwindigkeit oder Verständnis. Stell es als Frage von Komfort und Vorliebe vor und prüfe es im Einzelfall.",
        ],
      },
      {
        id: "adults",
        title: "Erwachsene",
        summary:
          "Für alle, die wieder mehr lesen möchten, sich aber nicht konzentrieren können, die Zeile verlieren oder schnell müde werden.",
        link: "So fängst du an",
        lede: "Wenn du gern mehr lesen würdest, aber schwer anfängst, die Zeile verlierst, denselben Satz dreimal liest oder auf Seite zwei schon müde bist, kann das hier helfen. Und wenn nicht, ist das auch in Ordnung.",
        steps: [
          "Installiere die Erweiterung und schalte sie mit Alt+B bei einem Artikel ein, der dich interessiert. Fang mit kurzen Texten an.",
          "Wandle ein Buch um, das du wirklich lesen möchtest, und lade es auf deinen E-Reader oder dein Handy.",
          "Stell die Stärke so ein, dass es sich angenehm anfühlt. Unter „Weitere Optionen“ kannst du den Zeilenabstand vergrößern und die Zeilen schmaler machen: Vielen hilft das genauso viel wie die Hervorhebung.",
          "Wenn es dich an einem Tag anstrengt, schalte es aus. Es ist deine Art zu lesen, keine Regel.",
        ],
        notes: [
          "Es hilft nicht allen, und das ist in Ordnung. Gib dir ein paar Tage, bevor du entscheidest.",
          "Wenn du vermutest, dass ADHS oder Legasthenie hinter deinen Schwierigkeiten stecken, kann ein Gespräch mit einer Fachperson helfen.",
        ],
      },
    ],
  },
  worksheets: {
    title: "Lese-Arbeitsblätter",
    nav: "Arbeitsblätter",
    intro:
      "Erstelle Arbeitsblätter mit großer Schrift, hervorgehobenen Wortanfängen und einem freundlichen Rahmen. Wähle einen Beispieltext oder schreib deinen eigenen, und drucke ihn dann aus oder lade ihn herunter.",
    editor: "Arbeitsblatt anpassen",
    example: "Text auswählen",
    titleLabel: "Titel",
    textLabel: "Text",
    theme: "Rahmen",
    themes: {
      none: "Kein Rahmen",
      simple: "Schlicht",
      clouds: "Wolken",
      garden: "Garten",
      stars: "Sterne",
      vehicles: "Autos und Lastwagen",
    },
    size: "Schriftgröße",
    sizes: ["Groß", "Sehr groß", "Riesig"],
    nameDate: "Name und Datum hinzufügen",
    name: "Name",
    date: "Datum",
    lines: "Schreiblinien",
    linesOptions: ["Keine", "3 Linien", "6 Linien", "10 Linien"],
    preview: "Vorschau",
    showPageSize: "Seitengröße anzeigen",
    pageSizes: {
      portrait: "A4 Hochformat (210 × 297 mm)",
      landscape: "A4 Querformat (297 × 210 mm)",
    },
    pageN: "Seite {n}",
    editHint:
      "Du kannst direkt auf dem Arbeitsblatt schreiben: Klick auf den Titel oder den Text. Die Hervorhebung wird angewendet, wenn du fertig bist.",
    editTitle: "Titel des Arbeitsblatts",
    editText: "Text des Arbeitsblatts",
    print: "Drucken oder als PDF speichern",
    download: "Arbeitsblatt herunterladen",
    printHint:
      "Um es als PDF zu speichern, wähle im Druckdialog „Als PDF speichern“. Gedruckt wird auf weißem Hintergrund, um Tinte zu sparen.",
    downloadHint:
      "Der Download ist eine Webseite, die du jederzeit öffnen und drucken kannst, auch ohne Internet.",
    fileName: "arbeitsblatt",
    tabs: { text: "Text", layout: "Layout", emphasis: "Hervorhebung" },
    myTexts: "Meine Texte",
    save: "In meinen Texten speichern",
    saved: "„{title}“ ist in meinen Texten gespeichert.",
    remove: "Aus meinen Texten entfernen",
    removed: "„{title}“ wurde aus meinen Texten entfernt.",
    exportTexts: "Meine Texte exportieren",
    importTexts: "Texte importieren",
    imported: "Importierte Texte: {n}.",
    importEmpty:
      "In dieser Datei sind keine Texte. Nimm eine .md-Datei mit Titeln, die mit „## “ beginnen, oder eine .txt-Datei.",
    libraryNote:
      "Deine Texte werden nur in diesem Browser gespeichert. Exportiere sie, um eine Kopie zu behalten, sie zu teilen oder auf einen anderen Computer mitzunehmen.",
    exportHeading: "Meine Texte für Arbeitsblätter",
    levelKey: "Stufe",
    textsFileName: "meine-arbeitsblatt-texte",
    orientation: "Ausrichtung",
    orientations: { portrait: "Hochformat", landscape: "Querformat" },
    overflow:
      "Das Arbeitsblatt geht auf eine zweite Seite über. Damit es auf eine passt, kürze den Text, wähle eine kleinere Schriftgröße oder entferne Linien.",
  },
  settings: {
    title: "Leseeinstellungen",
    open: "Leseeinstellungen öffnen",
    close: "Schließen",
    note: "Sie gelten für die Demo, die Arbeitsblätter und den Umwandler und werden nur in diesem Browser gespeichert.",
    presets: "Meine gespeicherten Einstellungen",
    empty:
      "Du hast noch keine Einstellungen gespeichert. Gib den aktuellen einen Namen, um mit einem Klick zu ihnen zurückzukehren.",
    name: "Name",
    placeholder: "Zum Beispiel: Lesen in der Klasse",
    save: "Speichern",
    apply: "Einstellungen „{name}“ verwenden",
    remove: "„{name}“ löschen",
    saved: "Einstellungen „{name}“ gespeichert.",
    removed: "„{name}“ wurde gelöscht.",
    applied: "Jetzt aktiv: „{name}“.",
    reset: "Zurück zu den Standardeinstellungen",
    restored: "Standardeinstellungen wiederhergestellt.",
  },
  convert: {
    title: "Buch umwandeln",
    intro:
      "Wähle ein Buch oder ein Dokument aus und lade eine Kopie mit Hervorhebung herunter. Die Datei verlässt nie dein Gerät: Alles passiert in diesem Browser, ohne Größenbegrenzung.",
    pick: "Datei auswählen",
    drop: "oder hier ablegen",
    formats: "EPUB, TXT, Markdown oder HTML",
    selected: "Ausgewählte Datei:",
    output: "Ausgabeformat",
    outputs: { epub: "EPUB (E-Book)", html: "HTML (Webseite)", md: "Markdown" },
    options: "Wie hervorheben",
    start: "Umwandeln",
    progress: "Wird umgewandelt: {n} %",
    cancel: "Abbrechen",
    cancelled: "Umwandlung abgebrochen. Es wurde nichts gespeichert.",
    done: "Fertig. Deine Datei ist bereit.",
    download: "{name} herunterladen",
    errors: {
      unsupported:
        "Dieses Format kann nicht umgewandelt werden. Wähle eine EPUB-, TXT-, Markdown- oder HTML-Datei.",
      drm: "Dieses Buch hat DRM (Kopierschutz) und kann deshalb nicht umgewandelt werden. Wenn du es gekauft hast, frag im Shop, ob du eine Kopie ohne DRM bekommen kannst.",
      invalid:
        "Diese Datei konnte nicht gelesen werden. Prüfe, ob sie sich in deinem Reader öffnen lässt, oder versuch eine andere.",
      failed:
        "Die Umwandlung ist fehlgeschlagen ({detail}). Wenn es wieder passiert, sag uns bitte auf GitHub Bescheid.",
    },
    labels: { part: "Teil", contents: "Inhalt" },
    steps: {
      choose: "Buch auswählen",
      adjust: "Aussehen anpassen",
      convert: "Umwandeln und herunterladen",
    },
    previewTitle: "So beginnt dein Buch",
    previewEmpty: "Wähle eine Datei aus, dann erscheint hier ihre erste Seite mit Hervorhebung.",
    previewLoading: "Vorschau wird vorbereitet …",
    previewNote:
      "Ungefähre Ansicht: Jeder Reader zeigt das Buch mit seiner eigenen Schrift und Größe.",
    previewNone:
      "Am Anfang der Datei wurde kein Text gefunden, aber du kannst sie trotzdem umwandeln.",
    change: "Andere Datei auswählen",
    devices: {
      heading: "So kommt es auf deinen E-Reader",
      items: [
        {
          name: "Kindle",
          text: "Nutze „Send to Kindle“ von Amazon (Website, App oder E-Mail) und wähle die EPUB-Datei. Amazon passt sie für deinen Kindle an.",
        },
        {
          name: "Kobo",
          text: "Verbinde deinen Kobo per USB-Kabel mit dem Computer und kopiere die EPUB-Datei darauf. Wirf ihn aus, und das Buch erscheint in deiner Bibliothek.",
        },
        {
          name: "PocketBook",
          text: "Kopiere sie per USB, wie bei einem Kobo, oder schick sie per E-Mail mit dem Dienst Send-to-PocketBook.",
        },
      ],
      calibre:
        "Wenn du Calibre nutzt, füge die Datei deiner Bibliothek hinzu und schick sie wie jedes andere Buch an deinen Reader.",
    },
  },
  pages: {
    privacy: {
      title: "Datenschutz",
      body: [
        "Wir sammeln keine Daten. Gar keine.",
        "Die Erweiterung, diese Website und der Umwandler laufen vollständig auf deinem Gerät. Was du liest und die Dateien, die du umwandelst, werden nirgendwohin gesendet: Wir haben keine Server.",
        "Wir verwenden keine Analyse, keine Cookies, keine Telemetrie und keine Schriften oder Skripte von anderen Websites.",
        "Die Erweiterung speichert deine Einstellungen (Stärke, Stil, Websites, auf denen sie immer an sein soll) im Speicher deines eigenen Browsers. Wenn die Browser-Synchronisierung aktiv ist, kann dein Browser sie zwischen deinen Geräten abgleichen; wir sehen sie nie.",
        "Die Erweiterung fragt nur nach den Berechtigungen, die sie braucht. Zugriff auf eine bestimmte Website oder auf alle Websites wird erst angefragt, wenn du „Immer auf dieser Website“ oder „Auf allen Websites“ wählst, und du kannst ihn jederzeit widerrufen.",
      ],
    },
    accessibility: {
      title: "Barrierefreiheit",
      body: [
        "Die Hervorhebung ändert nie, was ein Screenreader vorliest: Der Text ist exakt derselbe, Zeichen für Zeichen. Das prüfen wir mit automatischen Tests und vor jeder Veröffentlichung mit NVDA und VoiceOver.",
        "Alles funktioniert allein mit der Tastatur. Die Erweiterung schaltest du mit Alt+B ein und aus, und das Tastenkürzel kannst du in den Einstellungen deines Browsers ändern.",
        "Die Farben der Hervorhebung werden aus der Textfarbe selbst abgeleitet, damit der Kontrast im hellen und dunklen Modus und im Design jeder Website erhalten bleibt.",
        "Diese Website verwendet die Schrift Atkinson Hyperlegible, die dafür gestaltet ist, Buchstaben klar zu unterscheiden, und folgt den Einstellungen deines Systems für den dunklen Modus und reduzierte Bewegung.",
        "Wenn du auf eine Barriere stößt, eröffne bitte ein Issue auf GitHub: Das ist ein Fehler, und wir behandeln es auch so.",
      ],
    },
  },
};
