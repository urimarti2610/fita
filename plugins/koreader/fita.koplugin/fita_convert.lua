--[[
Creates an emphasized copy of an EPUB, HTML or TXT file, mirroring the web
converter (apps/web/src/convert) and the calibre plugin (engine/epub.py).

EPUB: every spine document is emphasized one at a time (one chapter in memory),
the emphasis stylesheet is added to its <head>, and the book is repackaged with
`mimetype` first and uncompressed. Metadata, images and fonts are copied as they
are. Any previous emphasis (from this plugin, calibre or fitaread.com) is removed
first, so converting twice never stacks.

Zip access goes through a small backend so tests can run without KOReader; the
default backend uses KOReader's ffi/archiver (libarchive).
]]

local Mk = require("fita_markup")

local M = {}

--- Font obfuscation is listed in encryption.xml too, but it is not DRM.
local FONT_OBFUSCATION = {
    ["http://www.idpf.org/2008/embedding"] = true,
    ["http://ns.adobe.com/pdf/enc#RC"] = true,
}

--- KOReader backend: libarchive through ffi/archiver.
function M.archiver_backend()
    local Archiver = require("ffi/archiver")
    return {
        open_reader = function(path)
            local reader = Archiver.Reader:new()
            if not reader:open(path) then return nil end
            return {
                list = function()
                    local entries = {}
                    for entry in reader:iterate() do
                        entries[#entries + 1] = { path = entry.path, file = entry.mode == "file" }
                    end
                    return entries
                end,
                read = function(path) return reader:extractToMemory(path) end,
                close = function() reader:close() end,
            }
        end,
        open_writer = function(path)
            local writer = Archiver.Writer:new{}
            if not writer:open(path, "epub") then return nil end
            return {
                add = function(name, content, store)
                    writer:setZipCompression(store and "store" or "deflate")
                    if not writer:addFileFromMemory(name, content) then
                        error("cannot write " .. name)
                    end
                end,
                close = function() writer:close() end,
            }
        end,
    }
end

local function attributes(tag)
    local result = {}
    for name, q, value in tag:gmatch("([%w:%.%-_]+)%s*=%s*([\"'])(.-)%2") do
        result[name:lower()] = value
    end
    return result
end

local function unescape_url(s)
    return (s:gsub("%%(%x%x)", function(h) return string.char(tonumber(h, 16)) end))
end

--- Resolves an href from the OPF against the OPF's folder, as a zip path.
local function resolve(base, href)
    local out = {}
    for part in (base .. unescape_url(href:gsub("#.*$", ""))):gmatch("[^/]+") do
        if part == ".." then
            out[#out] = nil
        elseif part ~= "." then
            out[#out + 1] = part
        end
    end
    return table.concat(out, "/")
end

function M.has_drm(files, read)
    if files["META-INF/rights.xml"] then return true end
    if not files["META-INF/encryption.xml"] then return false end
    local xml = read("META-INF/encryption.xml") or ""
    for algorithm in xml:gmatch("EncryptionMethod[^>]-Algorithm%s*=%s*[\"']([^\"']+)") do
        if not FONT_OBFUSCATION[algorithm] then return true end
    end
    return false
end

--- Zip paths of the (X)HTML documents in the spine.
function M.read_spine(files, read)
    local container = files["META-INF/container.xml"] and read("META-INF/container.xml")
    local opf_path = container and container:match("full%-path%s*=%s*[\"']([^\"']+)")
    local opf = opf_path and files[opf_path] and read(opf_path)
    if not opf then error({ code = "invalid" }) end
    local base = opf_path:match("^(.*/)") or ""
    local items = {}
    for tag in opf:gmatch("<[%w]*:?item%f[%s/>][^>]*>") do
        local a = attributes(tag)
        if a.id and a.href then items[a.id] = { href = resolve(base, a.href), type = a["media-type"] or "" } end
    end
    local spine, seen = {}, {}
    for tag in opf:gmatch("<[%w]*:?itemref%f[%s/>][^>]*>") do
        local item = items[attributes(tag).idref or ""]
        if item and item.type:find("html") and files[item.href] and not seen[item.href] then
            spine[#spine + 1] = item.href
            seen[item.href] = true
        end
    end
    return spine
end

--- Adds the emphasis stylesheet to a document's <head>.
function M.add_style(markup, css)
    local head = markup:find("</[hH][eE][aA][dD]%s*>")
    if not head then return markup end
    return markup:sub(1, head - 1) .. '<style type="text/css">' .. css .. "</style>" .. markup:sub(head)
end

--- Removes emphasis added by this plugin, the calibre plugin or the web converter.
function M.strip_emphasis(markup)
    markup = markup:gsub('(<style type="text/css">)(.-)(</style>)', function(open, css, close)
        local rest = css:gsub("%s*%.fita%-[er] {[^{}<]*}", "")
        if css:find("%.fita%-[er] {") and not rest:find("%S") then return "" end
        return open .. css .. close
    end)
    markup = markup:gsub('<span class="fita%-[er]">([^<]*)</span>', "%1")
    markup = markup:gsub('<b class="fita%-e">([^<]*)</b>', "%1")
    markup = markup:gsub('<u class="fita%-e">([^<]*)</u>', "%1")
    return markup
end

--- True when the document is UTF-8 (declared or by default): others are copied as they are.
local function utf8_document(markup)
    local encoding = markup:match("^\239?\187?\191?<%?xml[^>]-encoding%s*=%s*[\"']([%w%.:_%-]+)")
    return not encoding or encoding:lower():gsub("[_%-]", "") == "utf8"
end

--- A transform for one (X)HTML document with the given settings.
function M.transformer(options, style, semantic)
    local emphasize = Mk.create_markup_emphasizer(options, style, semantic)
    local css = Mk.static_css(style)
    return function(markup)
        if not utf8_document(markup) then return markup end
        return M.add_style(emphasize(M.strip_emphasis(markup)), css)
    end
end

--- Writes to `dst` an emphasized copy of the EPUB at `src`.
--- `progress(fraction)` may return false to cancel. Errors are tables with a `code`
--- ("drm", "invalid", "cancelled") or strings.
function M.convert_epub(src, dst, transform, backend, progress)
    backend = backend or M.archiver_backend()
    local reader = backend.open_reader(src)
    if not reader then error({ code = "invalid" }) end
    local ok, err = pcall(function()
        local entries = reader.list()
        local files = {}
        for _, e in ipairs(entries) do
            if e.file then files[e.path] = true end
        end
        if M.has_drm(files, reader.read) then error({ code = "drm" }) end
        local spine = M.read_spine(files, reader.read)
        local chapters = {}
        for _, path in ipairs(spine) do chapters[path] = true end
        local writer = backend.open_writer(dst)
        if not writer then error("cannot create " .. dst) end
        local done = 0
        local wrote, werr = pcall(function()
            writer.add("mimetype", "application/epub+zip", true)
            for _, e in ipairs(entries) do
                if e.file and e.path ~= "mimetype" then
                    local content = reader.read(e.path) or ""
                    if chapters[e.path] then
                        content = transform(content)
                        done = done + 1
                        if progress and progress(done / #spine) == false then error({ code = "cancelled" }) end
                    end
                    writer.add(e.path, content, false)
                end
            end
        end)
        writer.close()
        if not wrote then
            os.remove(dst)
            error(werr, 0)
        end
    end)
    reader.close()
    if not ok then error(err, 0) end
end

local function read_file(path)
    local f, err = io.open(path, "rb")
    if not f then error(err) end
    local data = f:read("*a")
    f:close()
    return data
end

local function write_file(path, data)
    local f, err = io.open(path, "wb")
    if not f then error(err) end
    f:write(data)
    f:close()
end

local function escape(text)
    return (text:gsub("&", "&amp;"):gsub("<", "&lt;"):gsub(">", "&gt;"))
end

--- Plain text as a minimal XHTML document: one paragraph per blank-line-separated block.
function M.text_to_html(text, title)
    text = text:gsub("^\239\187\191", ""):gsub("\r\n?", "\n")
    local paragraphs = {}
    for block in (text .. "\n\n"):gmatch("(.-)\n%s*\n") do
        if block:find("%S") then
            paragraphs[#paragraphs + 1] = "<p>" .. escape(block):gsub("\n", "<br/>") .. "</p>"
        end
    end
    return '<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE html>\n'
        .. '<html xmlns="http://www.w3.org/1999/xhtml">\n<head>\n<meta charset="utf-8"/>\n<title>'
        .. escape(title or "") .. "</title>\n</head>\n<body>\n" .. table.concat(paragraphs, "\n")
        .. "\n</body>\n</html>\n"
end

--- Writes to `dst` an emphasized copy of an HTML or TXT file.
function M.convert_document(src, dst, transform, css, is_text)
    local data = read_file(src)
    if is_text then
        data = M.text_to_html(data, src:match("([^/]+)%.[^.]+$") or src)
    end
    local out = transform(data)
    if not data:find("</[hH][eE][aA][dD]%s*>") then
        out = '<style type="text/css">' .. css .. "</style>\n" .. out
    end
    write_file(dst, out)
end

--- Formats this module can convert, by lowercase extension.
M.FORMATS = { epub = "epub", html = "html", htm = "html", xhtml = "html", txt = "txt" }

--- Path of the emphasized copy: book.epub -> book.fita.epub (book.txt -> book.fita.html).
function M.target_path(path)
    local stem, ext = path:match("^(.*)%.([^./]+)$")
    if not stem then return nil end
    local format = M.FORMATS[ext:lower()]
    if not format then return nil end
    stem = stem:gsub("%." .. Mk.ID .. "$", "")
    return stem .. "." .. Mk.ID .. "." .. (format == "txt" and "html" or ext), format
end

--- The original of an emphasized copy (book.fita.epub -> book.epub), when it exists.
function M.source_path(path, exists)
    local stem, ext = path:match("^(.*)%." .. Mk.ID .. "%.([^./]+)$")
    if not stem then return path end
    for _, candidate in ipairs({ stem .. "." .. ext, stem .. ".txt" }) do
        if exists(candidate) then return candidate end
    end
    return path
end

return M
