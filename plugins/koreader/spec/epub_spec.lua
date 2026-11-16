-- EPUB conversion with an in-memory zip backend (KOReader's libarchive is not needed).
local H = require("helper")
local E = require("fita_emphasis")
local Cv = require("fita_convert")
local describe, it, eq, truthy = H.describe, H.it, H.eq, H.truthy

local CHAPTER = [[<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="ca" xml:lang="ca">
<head><title>Capítol</title></head>
<body><p>L'àvia llegia &amp; somreia.</p><pre>codi intacte</pre></body>
</html>
]]
local OPF = [[<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>Llibre</dc:title></metadata>
<manifest>
<item id="c1" href="Text/chapter%201.xhtml" media-type="application/xhtml+xml"/>
<item id="img" href="Images/a.png" media-type="image/png"/>
</manifest>
<spine><itemref idref="c1"/></spine>
</package>
]]
local CONTAINER = [[<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
<rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>]]

local function book(extra)
    local files = {
        { "mimetype", "application/epub+zip" },
        { "META-INF/container.xml", CONTAINER },
        { "OEBPS/content.opf", OPF },
        { "OEBPS/Text/chapter 1.xhtml", CHAPTER },
        { "OEBPS/Images/a.png", "\137PNG binary" },
    }
    for _, f in ipairs(extra or {}) do files[#files + 1] = f end
    return files
end

--- Backend over Lua tables: archives[path] = { { name, content, stored? }, ... }.
local function memory(archives)
    return {
        open_reader = function(path)
            local files = archives[path]
            if not files then return nil end
            return {
                list = function()
                    local out = { { path = "OEBPS/", file = false } }
                    for _, f in ipairs(files) do out[#out + 1] = { path = f[1], file = true } end
                    return out
                end,
                read = function(name)
                    for _, f in ipairs(files) do if f[1] == name then return f[2] end end
                end,
                close = function() end,
            }
        end,
        open_writer = function(path)
            local files = {}
            return {
                add = function(name, content, store) files[#files + 1] = { name, content, store } end,
                close = function() archives[path] = files end,
            }
        end,
    }
end

local function entry(files, name)
    for _, f in ipairs(files) do if f[1] == name then return f[2] end end
end

describe("convert_epub", function()
    local transform = Cv.transformer(E.resolve_options(), "bold", true)

    it("emphasizes spine documents and copies the rest", function()
        local archives = { ["in.epub"] = book() }
        local fractions = {}
        Cv.convert_epub("in.epub", "out.epub", transform, memory(archives), function(f) fractions[#fractions + 1] = f end)
        local out = archives["out.epub"]
        eq(out[1][1], "mimetype")
        eq(out[1][3], true)
        eq(entry(out, "OEBPS/Images/a.png"), "\137PNG binary")
        eq(entry(out, "OEBPS/content.opf"), OPF)
        local chapter = entry(out, "OEBPS/Text/chapter 1.xhtml")
        truthy(chapter:find('<style type="text/css">.fita-e { font-weight: bold; }</style></head>', 1, true), chapter)
        truthy(chapter:find([[L'<b class="fita-e">àv</b>ia]], 1, true), chapter)
        truthy(chapter:find("<pre>codi intacte</pre>", 1, true))
        eq(#fractions, 1)
        eq(fractions[1], 1)
    end)

    it("never stacks emphasis", function()
        local archives = { ["in.epub"] = book() }
        Cv.convert_epub("in.epub", "a.epub", Cv.transformer(E.resolve_options(), "bold-fade"), memory(archives))
        Cv.convert_epub("a.epub", "b.epub", Cv.transformer(E.resolve_options(), "underline", true), memory(archives))
        local chapter = entry(archives["b.epub"], "OEBPS/Text/chapter 1.xhtml")
        local _, styles = chapter:gsub("<style", "")
        eq(styles, 1)
        truthy(not chapter:find("fita-r", 1, true))
        eq(Cv.strip_emphasis(chapter), CHAPTER)
    end)

    it("refuses books with DRM but accepts font obfuscation", function()
        local drm = '<encryption><EncryptedData><EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#aes128-cbc"/></EncryptedData></encryption>'
        local fonts = '<encryption><EncryptedData><EncryptionMethod Algorithm="http://www.idpf.org/2008/embedding"/></EncryptedData></encryption>'
        local archives = {
            ["drm.epub"] = book({ { "META-INF/encryption.xml", drm } }),
            ["fonts.epub"] = book({ { "META-INF/encryption.xml", fonts } }),
        }
        local ok, err = pcall(Cv.convert_epub, "drm.epub", "x.epub", transform, memory(archives))
        eq(ok, false)
        eq(err.code, "drm")
        Cv.convert_epub("fonts.epub", "y.epub", transform, memory(archives))
        truthy(archives["y.epub"])
    end)

    it("reports invalid books and cancels", function()
        local archives = { ["bad.epub"] = { { "mimetype", "application/epub+zip" } }, ["in.epub"] = book() }
        local ok, err = pcall(Cv.convert_epub, "bad.epub", "x.epub", transform, memory(archives))
        eq(ok, false)
        eq(err.code, "invalid")
        ok, err = pcall(Cv.convert_epub, "missing.epub", "x.epub", transform, memory(archives))
        eq(err.code, "invalid")
        ok, err = pcall(Cv.convert_epub, "in.epub", "z.epub", transform, memory(archives), function() return false end)
        eq(err.code, "cancelled")
    end)

    it("leaves documents in other encodings untouched", function()
        local latin = '<?xml version="1.0" encoding="ISO-8859-1"?><html><head></head><body><p>caf\233</p></body></html>'
        eq(transform(latin), latin)
    end)
end)

describe("paths and documents", function()
    it("names copies and finds originals", function()
        eq(Cv.target_path("/books/Llibre.epub"), "/books/Llibre.fita.epub")
        eq(Cv.target_path("/books/Llibre.fita.epub"), "/books/Llibre.fita.epub")
        eq(Cv.target_path("/books/notes.TXT"), "/books/notes.fita.html")
        eq(Cv.target_path("/books/comic.cbz"), nil)
        local exists = function(p) return p == "/books/Llibre.epub" end
        eq(Cv.source_path("/books/Llibre.fita.epub", exists), "/books/Llibre.epub")
        eq(Cv.source_path("/books/Other.fita.epub", exists), "/books/Other.fita.epub")
    end)

    it("turns text into paragraphs", function()
        local html = Cv.text_to_html("Hola <món>\r\nsegona línia\n\n\nAltre paràgraf\n", "notes")
        truthy(html:find("<p>Hola &lt;món&gt;<br/>segona línia</p>\n<p>Altre paràgraf</p>", 1, true), html)
        truthy(html:find("<title>notes</title>", 1, true))
    end)
end)
