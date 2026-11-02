import type { PageKey } from "../i18n";
import type { Strings } from "./es";

export const name = "English";

export const slugs: Record<PageKey, string> = {
  uses: "who-its-for",
  worksheets: "worksheets",
  convert: "convert",
  privacy: "privacy",
  accessibility: "accessibility",
};

export const strings: Strings = {
  meta: {
    description:
      "Free, open-source reading aid for people with ADHD and dyslexia: emphasizes the start of each word on the web and in your ebooks. Everything stays on your device.",
  },
  nav: {
    skip: "Skip to content",
    home: "Home",
    convert: "Convert a book",
    privacy: "Privacy",
    accessibility: "Accessibility",
    github: "Source code",
    language: "Language",
    theme: {
      label: "Theme",
      light: "light",
      dark: "dark",
    },
  },
  hero: {
    headline: "Read your way",
    lede: "Gently emphasizes the start of each word so your eyes have somewhere to land. For people with ADHD, dyslexia, or anyone who finds it more comfortable. Free, no accounts, and nothing ever leaves your device.",
  },
  install: {
    chrome: "Add to Chrome or Edge",
    firefox: "Add to Firefox",
    preview: "Not in the stores yet. Meanwhile, you can install the preview version from GitHub.",
  },
  demo: {
    heading: "Try it with your own text",
    intro: "Paste any text. The result updates instantly, and there is no length limit.",
    input: "Your text",
    output: "How it reads",
    sample:
      "Reading should feel comfortable. Some people lose their place, skip words or tire before the end of a paragraph. Marking the start of each word gives your eyes an anchor: try different strengths and styles until you find yours.",
    strength: "Strength",
    style: "Style",
    styles: {
      "bold-fade": "Bold and fade",
      bold: "Bold",
      color: "Colour",
      underline: "Underline",
      fade: "Fade the rest",
    },
    more: "More options",
    every: "Emphasize",
    everyOptions: ["Every word", "1 of every 2 words", "1 of every 3 words"],
    lineHeight: "Line spacing",
    maxWidth: "Maximum line width",
    pageDefault: "Normal",
    widths: ["Narrow (50 characters)", "Medium (65 characters)", "Wide (80 characters)"],
  },
  privacy: {
    heading: "Nothing leaves your device",
    body: [
      "The extension, this page and the book converter run entirely in your browser. There is no server to send anything to.",
      "No accounts, no analytics, no cookies and no usage limits.",
    ],
    more: "Read the privacy policy",
  },
  faq: {
    heading: "Questions",
    items: [
      {
        q: "Does it really work?",
        a: [
          "It depends on the person. Published studies so far do not show that, on average, people read faster or understand more with this kind of emphasis.",
          "What many people do report is that reading feels more comfortable, that they lose their place less, or that it is easier to get started. So we don't promise speed: we offer an aid you can tune or switch off. Try the demo and keep whatever helps.",
        ],
      },
      {
        q: "Does it cost anything?",
        a: [
          "No, and it never will. No paid tier, no word limit, no file size limit. It is free software under the MPL-2.0 licence.",
        ],
      },
      {
        q: "Can I use it with my ebooks?",
        a: [
          "Yes. In “Convert a book” you pick an EPUB, TXT, Markdown or HTML file and download a copy with emphasis. The conversion happens in your browser. Books with DRM cannot be converted.",
        ],
      },
      {
        q: "Does it work in any language?",
        a: [
          "In every language that separates words with spaces, including right-to-left scripts. Chinese, Japanese, Thai and other scripts without spaces are left as they are.",
        ],
      },
      {
        q: "What if I use a screen reader?",
        a: ["The text reads exactly as before: no characters are added or removed."],
      },
      {
        q: "Does it work on my phone?",
        a: ["Yes, with Firefox for Android. A dedicated app will come later."],
      },
    ],
  },
  footer: {
    license: "Free software under the MPL-2.0 licence.",
  },
  uses: {
    title: "Who it's for",
    intro:
      "Everyone reads in their own way. Here are some ways to use the tool depending on who you are and what you need it for. They all have one thing in common: it is an optional aid that you can tune or switch off, and it collects no data.",
    homeHeading: "Who it's for",
    how: "How to use it",
    care: "Keep in mind",
    cases: [
      {
        id: "education",
        title: "Education",
        summary:
          "For teachers, schools and families who want to adapt reading material without creating new material.",
        link: "Ideas for the classroom and home",
        lede: "For teachers, learning support teams and families who want reading to take a little less effort, without preparing different material for every student.",
        steps: [
          "Adapt the material you already have: convert readings, notes or books in EPUB, TXT, Markdown or HTML and share them as they are.",
          "In class, project the demo with the day's text and try different strengths and styles together. Let each student say what feels most comfortable.",
          "On school computers, the extension works without accounts or sign-ups and collects no student data.",
          "Make reading worksheets with large print and a friendly frame in “Worksheets”, then print them or save them as PDF.",
          "At home, the same extension helps with homework and reading on the web.",
        ],
        notes: [
          "It is an optional aid: it helps some students and not others. Let each one choose, and switch it off if they want.",
          "It does not replace educational support or the diagnosis of learning difficulties.",
        ],
      },
      {
        id: "speech-therapy",
        title: "Speech therapists and other professionals",
        summary:
          "For speech and language therapists, educational psychologists and counsellors looking for a simple tool to try in sessions.",
        link: "How to use it in sessions",
        lede: "For speech and language therapists, educational psychologists, counsellors and other professionals who support people with reading difficulties.",
        steps: [
          "In a session, paste a text into the demo and try several settings with the person. Note which one feels most comfortable: strength, style, emphasized words, line spacing.",
          "Prepare working material with the converter and hand it out on paper, on screen or on an ebook reader.",
          "Recommend the extension for home use, with the settings you chose together.",
          "Everything runs on the device: no text or patient data ever goes through a server.",
        ],
        notes: [
          "It is not a treatment or a reading intervention method. It can be one support within your work.",
          "Studies do not show an average gain in speed or comprehension. Present it as a matter of comfort and preference, and assess it case by case.",
        ],
      },
      {
        id: "adults",
        title: "Adults",
        summary:
          "For people who want to get back into reading but can't focus, lose their place or tire quickly.",
        link: "How to get started",
        lede: "If you want to read more but struggle to get started, lose your place, read the same sentence three times or get tired by page two, this might help. And if it doesn't, that's fine.",
        steps: [
          "Install the extension and turn it on with Alt+B on an article you care about. Start with short texts.",
          "Convert a book you actually want to read and put it on your ereader or phone.",
          "Adjust the strength until it feels comfortable. Under “More options” you can add line spacing and narrow the lines: for many people that helps as much as the emphasis.",
          "If it tires you one day, switch it off. It is your way of reading, not a rule.",
        ],
        notes: [
          "It doesn't work for everyone, and that's fine. Give it a few days before deciding.",
          "If you think ADHD or dyslexia might be behind your difficulties, talking to a professional can help.",
        ],
      },
    ],
  },
  worksheets: {
    title: "Reading worksheets",
    nav: "Worksheets",
    intro:
      "Make worksheets with large print, the start of each word emphasized and a friendly frame. Pick a sample text or write your own, then print it or download it.",
    editor: "Customize the worksheet",
    example: "Choose a text",
    titleLabel: "Title",
    textLabel: "Text",
    theme: "Frame",
    themes: {
      none: "No frame",
      simple: "Simple",
      clouds: "Clouds",
      garden: "Garden",
      stars: "Stars",
      vehicles: "Cars and trucks",
    },
    size: "Text size",
    sizes: ["Large", "Very large", "Huge"],
    nameDate: "Add name and date",
    name: "Name",
    date: "Date",
    lines: "Lines for writing",
    linesOptions: ["None", "3 lines", "6 lines", "10 lines"],
    preview: "Preview",
    showPageSize: "Show page size",
    pageSizes: { portrait: "A4 portrait (210 × 297 mm)", landscape: "A4 landscape (297 × 210 mm)" },
    pageN: "Page {n}",
    editHint:
      "You can type straight onto the worksheet: click the title or the text. Emphasis is applied when you finish.",
    editTitle: "Worksheet title",
    editText: "Worksheet text",
    print: "Print or save as PDF",
    download: "Download the worksheet",
    printHint:
      "To save it as a PDF, choose “Save as PDF” in the print dialog. It prints on a white background to save ink.",
    downloadHint: "The download is a web page you can open and print any time, even offline.",
    fileName: "worksheet",
    tabs: { text: "Text", layout: "Layout", emphasis: "Emphasis" },
    myTexts: "My texts",
    save: "Save to my texts",
    saved: "“{title}” is saved in my texts.",
    remove: "Remove from my texts",
    removed: "“{title}” was removed from my texts.",
    exportTexts: "Export my texts",
    importTexts: "Import texts",
    imported: "Texts imported: {n}.",
    importEmpty:
      "There are no texts in that file. Use a .md file with “## ” titles, or a .txt file.",
    libraryNote:
      "Your texts are stored only in this browser. Export them to keep a copy, share them or move them to another computer.",
    exportHeading: "My worksheet texts",
    levelKey: "Level",
    textsFileName: "my-worksheet-texts",
    orientation: "Orientation",
    orientations: { portrait: "Portrait", landscape: "Landscape" },
    overflow:
      "The worksheet runs onto a second page. To fit it on one, shorten the text, choose a smaller text size or remove lines.",
  },
  settings: {
    title: "Reading settings",
    open: "Open reading settings",
    close: "Close",
    note: "They apply to the demo, worksheets and converter, and are stored only in this browser.",
    presets: "My saved settings",
    empty:
      "You haven't saved any settings yet. Name the current ones to come back to them with one click.",
    name: "Name",
    placeholder: "For example: Class reading",
    save: "Save",
    apply: "Use the “{name}” settings",
    remove: "Delete “{name}”",
    saved: "“{name}” settings saved.",
    removed: "“{name}” was deleted.",
    applied: "Now using “{name}”.",
    reset: "Back to the default settings",
    restored: "Default settings restored.",
  },
  convert: {
    title: "Convert a book",
    intro:
      "Pick a book or a document and download a copy with emphasis. The file never leaves your device: everything happens in this browser, with no size limit.",
    pick: "Choose a file",
    drop: "or drop it here",
    formats: "EPUB, TXT, Markdown or HTML",
    selected: "Chosen file:",
    output: "Output format",
    outputs: { epub: "EPUB (ebook)", html: "HTML (web page)", md: "Markdown" },
    options: "How to emphasize",
    start: "Convert",
    progress: "Converting: {n} %",
    cancel: "Cancel",
    cancelled: "Conversion cancelled. Nothing was saved.",
    done: "Done. Your file is ready.",
    download: "Download {name}",
    errors: {
      unsupported: "This format can't be converted. Choose an EPUB, TXT, Markdown or HTML file.",
      drm: "This book has DRM (copy protection), so it can't be converted. If you bought it, ask the store whether they can give you a DRM-free copy.",
      invalid:
        "This file couldn't be read. Check that it opens in your reader, or try another one.",
      failed: "The conversion failed ({detail}). If it happens again, please tell us on GitHub.",
    },
    labels: { part: "Part", contents: "Contents" },
    steps: {
      choose: "Choose your book",
      adjust: "Adjust how it looks",
      convert: "Convert and download",
    },
    previewTitle: "How your book will start",
    previewEmpty: "Choose a file and its first page will appear here, with emphasis.",
    previewLoading: "Preparing the preview…",
    previewNote: "Approximate view: every reader shows the book with its own font and size.",
    previewNone: "No text was found at the start of the file, but you can still convert it.",
    change: "Choose another file",
    devices: {
      heading: "Getting it onto your reader",
      items: [
        {
          name: "Kindle",
          text: "Use Amazon's Send to Kindle (website, app or email) and choose the EPUB file. Amazon adapts it for your Kindle.",
        },
        {
          name: "Kobo",
          text: "Connect your Kobo to your computer with the USB cable and copy the EPUB onto it. Eject it and the book appears in your library.",
        },
        {
          name: "PocketBook",
          text: "Copy it over USB, as with a Kobo, or email it with the Send-to-PocketBook service.",
        },
      ],
      calibre:
        "If you use Calibre, add the file to your library and send it to your reader like any other book.",
    },
  },
  pages: {
    privacy: {
      title: "Privacy",
      body: [
        "We collect no data. None.",
        "The extension, this website and the converter run entirely on your device. What you read and the files you convert are never sent anywhere: we have no servers.",
        "We use no analytics, cookies, telemetry, or fonts and scripts from other sites.",
        "The extension stores your settings (strength, style, sites where you want it always on) in your own browser's storage. If browser sync is on, your browser may copy them between your devices; we never see them.",
        "The extension asks only for the permissions it needs. Access to a specific site, or to all sites, is requested only when you choose “Always on this site” or “On all sites”, and you can revoke it at any time.",
      ],
    },
    accessibility: {
      title: "Accessibility",
      body: [
        "Emphasis never changes what a screen reader reads: the text is exactly the same, character by character. We check this with automated tests, and with NVDA and VoiceOver before each release.",
        "Everything works with the keyboard alone. The extension toggles with Alt+B, and you can change the shortcut in your browser's settings.",
        "Emphasis colours are derived from the text's own colour, so contrast holds in light mode, dark mode and each site's theme.",
        "This website uses the Atkinson Hyperlegible typeface, designed to tell letters apart clearly, and follows your system's dark mode and reduced-motion preferences.",
        "If you hit a barrier, please open an issue on GitHub: it is a bug, and we will treat it as one.",
      ],
    },
  },
};
