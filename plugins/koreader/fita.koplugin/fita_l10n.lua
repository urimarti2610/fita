--[[
Interface strings in Spanish and Catalan (English is the source). KOReader's
gettext only reads its own catalogs, so third-party plugins ship their own.
The language follows KOReader's (Settings > Language).
]]

local CATALOGS = {
    es = {
        ["Reading emphasis"] = "Énfasis de lectura",
        ["Create a copy with emphasis"] = "Crear una copia con énfasis",
        ["Strength: %1 %"] = "Intensidad: %1 %",
        ["Strength"] = "Intensidad",
        ["Part of each word to emphasize"] = "Parte de cada palabra que se destaca",
        ["Style"] = "Estilo",
        ["Bold"] = "Negrita",
        ["Soft underline"] = "Subrayado suave",
        ["Colour"] = "Color",
        ["Emphasize one word in every: %1"] = "Destacar una palabra de cada: %1",
        ["Emphasize one word in every"] = "Destacar una palabra de cada",
        ["Open the copy when it is ready"] = "Abrir la copia cuando esté lista",
        ["About"] = "Acerca de",
        ["Creating a copy with emphasis…\n\nTap to cancel."] = "Creando una copia con énfasis…\n\nToca para cancelar.",
        ["Copy created:\n%1"] = "Copia creada:\n%1",
        ["This book is protected with DRM and cannot be converted."] = "Este libro está protegido con DRM y no se puede convertir.",
        ["This file is not a valid EPUB book."] = "Este archivo no es un libro EPUB válido.",
        ["The copy could not be created:\n%1"] = "No se ha podido crear la copia:\n%1",
        ["Only EPUB, HTML and TXT files can be converted."] = "Solo se pueden convertir archivos EPUB, HTML y TXT.",
        ["fita adds anchor points to text: it gently emphasizes the start of each word to guide your eyes.\n\nKOReader cannot change how words are drawn, so the plugin creates an emphasized copy of the book next to the original (book.fita.epub). Change the settings and create the copy again whenever you like: the original is never modified.\n\nEverything happens on this device. %1"] =
            "fita añade puntos de anclaje al texto: destaca con suavidad el inicio de cada palabra para guiar la vista.\n\nKOReader no puede cambiar cómo se dibujan las palabras, así que el plugin crea una copia con énfasis junto al original (libro.fita.epub). Cambia los ajustes y vuelve a crear la copia cuando quieras: el original nunca se modifica.\n\nTodo ocurre en este dispositivo. %1",
    },
    ca = {
        ["Reading emphasis"] = "Èmfasi de lectura",
        ["Create a copy with emphasis"] = "Crea una còpia amb èmfasi",
        ["Strength: %1 %"] = "Intensitat: %1 %",
        ["Strength"] = "Intensitat",
        ["Part of each word to emphasize"] = "Part de cada paraula que es destaca",
        ["Style"] = "Estil",
        ["Bold"] = "Negreta",
        ["Soft underline"] = "Subratllat suau",
        ["Colour"] = "Color",
        ["Emphasize one word in every: %1"] = "Destaca una paraula de cada: %1",
        ["Emphasize one word in every"] = "Destaca una paraula de cada",
        ["Open the copy when it is ready"] = "Obre la còpia quan estigui llesta",
        ["About"] = "Quant a",
        ["Creating a copy with emphasis…\n\nTap to cancel."] = "S'està creant una còpia amb èmfasi…\n\nToca per cancel·lar.",
        ["Copy created:\n%1"] = "Còpia creada:\n%1",
        ["This book is protected with DRM and cannot be converted."] = "Aquest llibre està protegit amb DRM i no es pot convertir.",
        ["This file is not a valid EPUB book."] = "Aquest fitxer no és un llibre EPUB vàlid.",
        ["The copy could not be created:\n%1"] = "No s'ha pogut crear la còpia:\n%1",
        ["Only EPUB, HTML and TXT files can be converted."] = "Només es poden convertir fitxers EPUB, HTML i TXT.",
        ["fita adds anchor points to text: it gently emphasizes the start of each word to guide your eyes.\n\nKOReader cannot change how words are drawn, so the plugin creates an emphasized copy of the book next to the original (book.fita.epub). Change the settings and create the copy again whenever you like: the original is never modified.\n\nEverything happens on this device. %1"] =
            "fita afegeix punts d'ancoratge al text: destaca amb suavitat l'inici de cada paraula per guiar la vista.\n\nKOReader no pot canviar com es dibuixen les paraules, així que el connector crea una còpia amb èmfasi al costat de l'original (llibre.fita.epub). Canvia la configuració i torna a crear la còpia quan vulguis: l'original no es modifica mai.\n\nTot passa en aquest dispositiu. %1",
    },
}

local M = { catalogs = CATALOGS }

--- Language code from KOReader's setting ("es", "ca_ES", ...), or nil.
function M.language()
    local ok, lang = pcall(function() return G_reader_settings:readSetting("language") end)
    lang = ok and lang or os.getenv("LANGUAGE") or os.getenv("LANG") or ""
    return lang:match("^(%a%a)")
end

--- Translates `text` and fills %1, %2... with the extra arguments.
function M.translate(lang, text, ...)
    local catalog = CATALOGS[lang or ""] or {}
    local out = catalog[text] or text
    local args = { ... }
    return (out:gsub("%%(%d)", function(n) return tostring(args[tonumber(n)] or "") end))
end

--- A translator bound to KOReader's current language.
function M.translator()
    local lang = M.language()
    return function(text, ...) return M.translate(lang, text, ...) end
end

return M
