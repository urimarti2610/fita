import type { PageKey } from "../i18n";
import type { Strings } from "./es";

export const name = "Polski";

export const slugs: Record<PageKey, string> = {
  uses: "dla-kogo",
  worksheets: "karty-pracy",
  convert: "konwertuj",
  privacy: "prywatnosc",
  accessibility: "dostepnosc",
};

export const strings: Strings = {
  meta: {
    description:
      "Bezpłatna pomoc w czytaniu z otwartym kodem dla osób z ADHD i dysleksją: wyróżnia początek każdego słowa w internecie i w twoich e-bookach. Wszystko zostaje na twoim urządzeniu.",
  },
  nav: {
    skip: "Przejdź do treści",
    home: "Strona główna",
    convert: "Konwertuj książkę",
    privacy: "Prywatność",
    accessibility: "Dostępność",
    github: "Kod źródłowy",
    language: "Język",
    theme: {
      label: "Motyw",
      light: "jasny",
      dark: "ciemny",
    },
  },
  hero: {
    headline: "Czytaj po swojemu",
    lede: "Delikatnie wyróżnia początek każdego słowa, żeby wzrok miał się o co zaczepić. Dla osób z ADHD, dysleksją i dla każdego, komu tak jest wygodniej. Za darmo, bez zakładania konta, a nic nie opuszcza twojego urządzenia.",
  },
  install: {
    chrome: "Dodaj do Chrome lub Edge",
    firefox: "Dodaj do Firefoksa",
    preview:
      "Jeszcze nie ma tego w sklepach. Do tego czasu możesz zainstalować wersję testową z GitHuba.",
  },
  demo: {
    heading: "Wypróbuj na własnym tekście",
    intro: "Wklej dowolny tekst. Wynik zmienia się od razu i nie ma limitu długości.",
    input: "Twój tekst",
    output: "Jak to wygląda",
    sample:
      "Czytanie powinno być wygodne. Niektórzy gubią miejsce w tekście, przeskakują słowa albo męczą się przed końcem akapitu. Wyróżniony początek każdego słowa daje wzrokowi punkt zaczepienia: wypróbuj różne natężenia i style, aż znajdziesz swój.",
    strength: "Natężenie",
    style: "Styl",
    styles: {
      "bold-fade": "Pogrubienie i przygaszenie",
      bold: "Pogrubienie",
      color: "Kolor",
      underline: "Podkreślenie",
      fade: "Przygaś resztę",
    },
    more: "Więcej opcji",
    every: "Wyróżniaj",
    everyOptions: ["Każde słowo", "Co drugie słowo", "Co trzecie słowo"],
    lineHeight: "Odstęp między wierszami",
    maxWidth: "Maksymalna szerokość wiersza",
    pageDefault: "Normalny",
    widths: ["Wąski (50 znaków)", "Średni (65 znaków)", "Szeroki (80 znaków)"],
  },
  privacy: {
    heading: "Nic nie opuszcza twojego urządzenia",
    body: [
      "Rozszerzenie, ta strona i konwerter książek działają w całości w twojej przeglądarce. Nie ma serwera, na który cokolwiek można by wysłać.",
      "Bez kont, bez analityki, bez ciasteczek i bez limitów użycia.",
    ],
    more: "Przeczytaj politykę prywatności",
  },
  faq: {
    heading: "Pytania",
    items: [
      {
        q: "Czy to naprawdę działa?",
        a: [
          "To zależy od osoby. Dotychczas opublikowane badania nie pokazują, że przy takim wyróżnieniu ludzie czytają średnio szybciej albo więcej rozumieją.",
          "Wiele osób mówi natomiast, że czyta im się wygodniej, rzadziej gubią miejsce w tekście albo łatwiej im zacząć. Dlatego nie obiecujemy szybkości: oferujemy pomoc, którą możesz dostosować albo wyłączyć. Wypróbuj demo i zostaw to, co ci pomaga.",
        ],
      },
      {
        q: "Czy to coś kosztuje?",
        a: [
          "Nie i nigdy nie będzie. Bez płatnej wersji, bez limitu słów, bez limitu rozmiaru pliku. To wolne oprogramowanie na licencji Apache-2.0.",
        ],
      },
      {
        q: "Czy mogę używać tego z moimi e-bookami?",
        a: [
          "Tak. W zakładce „Konwertuj książkę” wybierasz plik EPUB, TXT, Markdown lub HTML i pobierasz kopię z wyróżnieniem. Konwersja odbywa się w twojej przeglądarce. Książek z DRM nie da się przekonwertować.",
        ],
      },
      {
        q: "Czy działa w każdym języku?",
        a: [
          "W każdym języku, który oddziela słowa spacjami, także w pismach zapisywanych od prawej do lewej. Chiński, japoński, tajski i inne pisma bez spacji zostają bez zmian.",
        ],
      },
      {
        q: "A jeśli korzystam z czytnika ekranu?",
        a: [
          "Tekst czyta się dokładnie tak jak wcześniej: żaden znak nie jest dodawany ani usuwany.",
        ],
      },
      {
        q: "Czy działa na telefonie?",
        a: ["Tak, w Firefoksie na Androida. Osobna aplikacja pojawi się później."],
      },
    ],
  },
  footer: {
    license: "Wolne oprogramowanie na licencji Apache-2.0.",
  },
  uses: {
    title: "Dla kogo",
    intro:
      "Każdy czyta na swój sposób. Oto kilka pomysłów na korzystanie z tego narzędzia w zależności od tego, kim jesteś i do czego go potrzebujesz. Łączy je jedno: to dobrowolna pomoc, którą możesz dostosować albo wyłączyć, i która nie zbiera żadnych danych.",
    homeHeading: "Dla kogo",
    how: "Jak z tego korzystać",
    care: "Warto pamiętać",
    cases: [
      {
        id: "education",
        title: "Edukacja",
        summary:
          "Dla nauczycieli, szkół i rodzin, które chcą dostosować teksty do czytania bez tworzenia nowych materiałów.",
        link: "Pomysły do klasy i do domu",
        lede: "Dla nauczycieli, zespołów wsparcia i rodzin, które chcą, żeby czytanie wymagało trochę mniej wysiłku, bez przygotowywania osobnych materiałów dla każdego ucznia.",
        steps: [
          "Dostosuj materiały, które już masz: przekonwertuj czytanki, notatki albo książki w formacie EPUB, TXT, Markdown lub HTML i udostępnij je od razu.",
          "Na lekcji wyświetl demo z tekstem na dany dzień i razem wypróbujcie różne natężenia i style. Niech każdy uczeń powie, co jest dla niego najwygodniejsze.",
          "Na szkolnych komputerach rozszerzenie działa bez kont i rejestracji i nie zbiera żadnych danych uczniów.",
          "W zakładce „Karty pracy” przygotujesz karty do czytania z dużą czcionką i przyjazną ramką, a potem je wydrukujesz albo zapiszesz jako PDF.",
          "W domu to samo rozszerzenie pomaga przy odrabianiu lekcji i czytaniu w internecie.",
        ],
        notes: [
          "To dobrowolna pomoc: jednym uczniom pomaga, innym nie. Pozwól każdemu wybrać i wyłączyć ją, jeśli zechce.",
          "Nie zastępuje wsparcia pedagogicznego ani diagnozy trudności w uczeniu się.",
        ],
      },
      {
        id: "speech-therapy",
        title: "Logopedzi i inni specjaliści",
        summary:
          "Dla logopedów, psychologów szkolnych i pedagogów, którzy szukają prostego narzędzia do wypróbowania podczas zajęć.",
        link: "Jak używać na zajęciach",
        lede: "Dla logopedów, psychologów szkolnych, pedagogów i innych specjalistów, którzy wspierają osoby z trudnościami w czytaniu.",
        steps: [
          "Podczas zajęć wklej tekst do demo i wypróbujcie razem kilka ustawień. Zanotuj, które jest najwygodniejsze: natężenie, styl, wyróżniane słowa, odstęp między wierszami.",
          "Przygotuj materiały w konwerterze i daj je na papierze, na ekranie albo na czytniku e-booków.",
          "Poleć rozszerzenie do używania w domu, z ustawieniami wybranymi wspólnie.",
          "Wszystko działa na urządzeniu: żaden tekst ani dane pacjentów nie trafiają na serwer.",
        ],
        notes: [
          "To nie jest terapia ani metoda interwencji w czytaniu. Może być jednym ze wsparć w twojej pracy.",
          "Badania nie pokazują średniego wzrostu szybkości ani rozumienia. Przedstawiaj to jako kwestię wygody i preferencji i oceniaj indywidualnie.",
        ],
      },
      {
        id: "adults",
        title: "Dorośli",
        summary:
          "Dla osób, które chcą wrócić do czytania, ale nie mogą się skupić, gubią miejsce w tekście albo szybko się męczą.",
        link: "Jak zacząć",
        lede: "Jeśli chcesz czytać więcej, ale trudno ci zacząć, gubisz miejsce w tekście, czytasz to samo zdanie trzy razy albo męczysz się już na drugiej stronie, to może pomóc. A jeśli nie pomoże, to też w porządku.",
        steps: [
          "Zainstaluj rozszerzenie i włącz je skrótem Alt+B na artykule, który cię interesuje. Zacznij od krótkich tekstów.",
          "Przekonwertuj książkę, którą naprawdę chcesz przeczytać, i wgraj ją na czytnik albo telefon.",
          "Dostosuj natężenie, aż będzie wygodnie. W „Więcej opcji” możesz zwiększyć odstęp między wierszami i zwęzić wiersze: wielu osobom pomaga to tak samo jak wyróżnienie.",
          "Jeśli któregoś dnia cię to męczy, wyłącz je. To twój sposób czytania, a nie obowiązek.",
        ],
        notes: [
          "Nie każdemu to pomaga i to jest w porządku. Daj sobie kilka dni, zanim zdecydujesz.",
          "Jeśli podejrzewasz, że za twoimi trudnościami może stać ADHD albo dysleksja, rozmowa ze specjalistą może pomóc.",
        ],
      },
    ],
  },
  worksheets: {
    title: "Karty do czytania",
    nav: "Karty pracy",
    intro:
      "Przygotuj karty z dużą czcionką, wyróżnionym początkiem każdego słowa i przyjazną ramką. Wybierz przykładowy tekst albo napisz własny, a potem wydrukuj albo pobierz kartę.",
    editor: "Dostosuj kartę",
    example: "Wybierz tekst",
    titleLabel: "Tytuł",
    textLabel: "Tekst",
    theme: "Ramka",
    themes: {
      none: "Bez ramki",
      simple: "Prosta",
      clouds: "Chmurki",
      garden: "Ogród",
      stars: "Gwiazdy",
      vehicles: "Auta i ciężarówki",
    },
    size: "Rozmiar tekstu",
    sizes: ["Duży", "Bardzo duży", "Ogromny"],
    nameDate: "Dodaj imię i datę",
    name: "Imię",
    date: "Data",
    lines: "Linie do pisania",
    linesOptions: ["Bez linii", "3 linie", "6 linii", "10 linii"],
    preview: "Podgląd",
    showPageSize: "Pokaż rozmiar strony",
    pageSizes: { portrait: "A4 pionowo (210 × 297 mm)", landscape: "A4 poziomo (297 × 210 mm)" },
    pageN: "Strona {n}",
    editHint:
      "Możesz pisać bezpośrednio na karcie: kliknij tytuł albo tekst. Wyróżnienie pojawi się, gdy skończysz.",
    editTitle: "Tytuł karty",
    editText: "Tekst karty",
    print: "Drukuj lub zapisz jako PDF",
    download: "Pobierz kartę",
    printHint:
      "Aby zapisać jako PDF, wybierz „Zapisz jako PDF” w oknie drukowania. Karta drukuje się na białym tle, żeby oszczędzać tusz.",
    downloadHint:
      "Pobierasz stronę internetową, którą możesz otworzyć i wydrukować w każdej chwili, także bez internetu.",
    fileName: "karta-pracy",
    tabs: { text: "Tekst", layout: "Układ", emphasis: "Wyróżnienie" },
    myTexts: "Moje teksty",
    save: "Zapisz w moich tekstach",
    saved: "„{title}” jest zapisany w moich tekstach.",
    remove: "Usuń z moich tekstów",
    removed: "„{title}” usunięto z moich tekstów.",
    exportTexts: "Eksportuj moje teksty",
    importTexts: "Importuj teksty",
    imported: "Zaimportowane teksty: {n}.",
    importEmpty: "W tym pliku nie ma tekstów. Użyj pliku .md z tytułami „## ” albo pliku .txt.",
    libraryNote:
      "Twoje teksty są zapisane tylko w tej przeglądarce. Wyeksportuj je, żeby mieć kopię, udostępnić je albo przenieść na inny komputer.",
    exportHeading: "Moje teksty do kart pracy",
    levelKey: "Poziom",
    textsFileName: "moje-teksty-do-kart",
    orientation: "Orientacja",
    orientations: { portrait: "Pionowa", landscape: "Pozioma" },
    overflow:
      "Karta nie mieści się na jednej stronie. Aby się zmieściła, skróć tekst, wybierz mniejszy rozmiar tekstu albo usuń linie.",
  },
  settings: {
    title: "Ustawienia czytania",
    open: "Otwórz ustawienia czytania",
    close: "Zamknij",
    note: "Działają w demo, kartach pracy i konwerterze i są zapisane tylko w tej przeglądarce.",
    presets: "Moje zapisane ustawienia",
    empty:
      "Nie masz jeszcze zapisanych ustawień. Nazwij obecne, żeby wracać do nich jednym kliknięciem.",
    name: "Nazwa",
    placeholder: "Na przykład: Czytanie w klasie",
    save: "Zapisz",
    apply: "Użyj ustawień „{name}”",
    remove: "Usuń „{name}”",
    saved: "Zapisano ustawienia „{name}”.",
    removed: "Usunięto „{name}”.",
    applied: "Teraz używane: „{name}”.",
    reset: "Przywróć ustawienia domyślne",
    restored: "Przywrócono ustawienia domyślne.",
  },
  convert: {
    title: "Konwertuj książkę",
    intro:
      "Wybierz książkę albo dokument i pobierz kopię z wyróżnieniem. Plik nigdy nie opuszcza twojego urządzenia: wszystko dzieje się w tej przeglądarce, bez limitu rozmiaru.",
    pick: "Wybierz plik",
    drop: "albo upuść go tutaj",
    formats: "EPUB, TXT, Markdown lub HTML",
    selected: "Wybrany plik:",
    output: "Format wyjściowy",
    outputs: { epub: "EPUB (e-book)", html: "HTML (strona internetowa)", md: "Markdown" },
    options: "Jak wyróżniać",
    start: "Konwertuj",
    progress: "Konwertowanie: {n} %",
    cancel: "Anuluj",
    cancelled: "Konwersja anulowana. Nic nie zostało zapisane.",
    done: "Gotowe. Twój plik jest gotowy.",
    download: "Pobierz {name}",
    errors: {
      unsupported:
        "Tego formatu nie da się przekonwertować. Wybierz plik EPUB, TXT, Markdown lub HTML.",
      drm: "Ta książka ma DRM (zabezpieczenie przed kopiowaniem), więc nie da się jej przekonwertować. Jeśli ją kupiono, zapytaj w sklepie, czy mogą udostępnić kopię bez DRM.",
      invalid:
        "Nie udało się odczytać tego pliku. Sprawdź, czy otwiera się w twoim czytniku, albo spróbuj z innym.",
      failed:
        "Konwersja się nie powiodła ({detail}). Jeśli to się powtórzy, daj nam znać na GitHubie.",
    },
    labels: { part: "Część", contents: "Spis treści" },
    steps: {
      choose: "Wybierz książkę",
      adjust: "Dostosuj wygląd",
      convert: "Konwertuj i pobierz",
    },
    previewTitle: "Tak zacznie się twoja książka",
    previewEmpty: "Wybierz plik, a tutaj pojawi się jego pierwsza strona z wyróżnieniem.",
    previewLoading: "Przygotowywanie podglądu…",
    previewNote:
      "Widok przybliżony: każdy czytnik pokazuje książkę własną czcionką i w swoim rozmiarze.",
    previewNone: "Na początku pliku nie znaleziono tekstu, ale nadal możesz go przekonwertować.",
    change: "Wybierz inny plik",
    devices: {
      heading: "Jak przenieść książkę na czytnik",
      items: [
        {
          name: "Kindle",
          text: "Użyj usługi Amazon Send to Kindle (strona, aplikacja lub e-mail) i wybierz plik EPUB. Amazon dostosuje go do twojego Kindle'a.",
        },
        {
          name: "Kobo",
          text: "Podłącz Kobo do komputera kablem USB i skopiuj na niego plik EPUB. Odłącz czytnik, a książka pojawi się w bibliotece.",
        },
        {
          name: "PocketBook",
          text: "Skopiuj plik przez USB, tak jak w przypadku Kobo, albo wyślij go e-mailem przez usługę Send-to-PocketBook.",
        },
      ],
      calibre:
        "Jeśli używasz Calibre, dodaj plik do biblioteki i wyślij go na czytnik jak każdą inną książkę.",
    },
  },
  pages: {
    privacy: {
      title: "Prywatność",
      body: [
        "Nie zbieramy żadnych danych. Żadnych.",
        "Rozszerzenie, ta strona i konwerter działają w całości na twoim urządzeniu. To, co czytasz, i pliki, które konwertujesz, nigdy nigdzie nie są wysyłane: nie mamy serwerów.",
        "Nie używamy analityki, ciasteczek, telemetrii ani czcionek i skryptów z innych stron.",
        "Rozszerzenie zapisuje twoje ustawienia (natężenie, styl, strony, na których ma być zawsze włączone) w pamięci twojej własnej przeglądarki. Jeśli synchronizacja przeglądarki jest włączona, przeglądarka może kopiować je między twoimi urządzeniami; my nigdy ich nie widzimy.",
        "Rozszerzenie prosi tylko o uprawnienia, których potrzebuje. O dostęp do konkretnej strony albo do wszystkich stron prosi dopiero wtedy, gdy wybierzesz „Zawsze na tej stronie” albo „Na wszystkich stronach”, i w każdej chwili możesz go cofnąć.",
      ],
    },
    accessibility: {
      title: "Dostępność",
      body: [
        "Wyróżnienie nigdy nie zmienia tego, co odczytuje czytnik ekranu: tekst jest dokładnie taki sam, znak po znaku. Sprawdzamy to testami automatycznymi oraz w NVDA i VoiceOver przed każdym wydaniem.",
        "Wszystko działa wyłącznie z klawiatury. Rozszerzenie włącza się i wyłącza skrótem Alt+B, a skrót możesz zmienić w ustawieniach przeglądarki.",
        "Kolory wyróżnienia wynikają z koloru samego tekstu, więc kontrast zostaje zachowany w trybie jasnym, ciemnym i w motywie każdej strony.",
        "Ta strona używa kroju Atkinson Hyperlegible, zaprojektowanego tak, by litery łatwo było od siebie odróżnić, i stosuje się do ustawień trybu ciemnego i ograniczonego ruchu w twoim systemie.",
        "Jeśli natrafisz na barierę, zgłoś to na GitHubie: to błąd i tak go potraktujemy.",
      ],
    },
  },
};
