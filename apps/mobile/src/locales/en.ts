// Interface strings that only the reader app needs. Everything shared with the
// website (emphasis controls, error messages, privacy) comes from
// apps/web/src/locales/<lang>.ts. This file defines the shape the others must match.

export const strings = {
  library: {
    heading: "Library",
    intro:
      "Open a book or paste a text to read it with emphasis. Your files and where you stopped reading stay on this device.",
    open: "Open a file",
    paste: "Paste a text",
    empty: "There is nothing here yet. Books and texts you open will appear here.",
    progress: "{n} % read",
    remove: "Remove “{title}” from the library",
    removed: "“{title}” was removed from the library.",
    opening: "Opening…",
    notSaved:
      "This file could not be saved on the device. You can read it now, but it will not stay in the library.",
    missing: "That book is no longer on this device.",
  },
  paste: {
    heading: "Paste a text",
    title: "Title (optional)",
    text: "Text",
    untitled: "Pasted text",
    read: "Read",
    cancel: "Cancel",
  },
  reader: {
    library: "Library",
    settings: "Settings",
    previous: "Previous",
    next: "Next",
    position: "{n} of {total}",
    empty: "This part has no text.",
    emphasis: "Emphasis",
    textSize: "Text size",
    sizes: ["Normal", "Large", "Very large", "Huge"],
    theme: "Theme",
    themes: { system: "Same as the device", light: "Light", dark: "Dark" },
    language: "Language",
    deviceLanguage: "Same as the device",
  },
};

export type AppStrings = typeof strings;
