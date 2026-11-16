--[[
Markup-level emphasis for (X)HTML strings: a Lua port of packages/core/src/markup.ts.

Text between tags is emphasized; tags, attributes, comments and skipped elements
pass through byte for byte. Same classes and stylesheet as the web converter.
]]

local E = require("fita_emphasis")
local concat = table.concat

local M = {}

M.ID = "fita"
M.EMPHASIS_CLASS = M.ID .. "-e"
M.REST_CLASS = M.ID .. "-r"
M.STYLES = { "bold-fade", "bold", "color", "underline", "fade" }
M.DEFAULT_STYLE = "bold-fade"

local function set(list)
    local t = {}
    for word in list:gmatch("%S+") do t[word] = true end
    return t
end

--- Elements whose content is copied verbatim.
local SKIP_TAGS = set("head script style noscript textarea select option code pre kbd samp svg math canvas iframe title template")
--- Raw-text elements: their content may contain "<" and is skipped wholesale.
local RAW_TEXT_TAGS = set("script style textarea title xmp noscript")
local VOID_TAGS = set("area base br col embed hr img input link meta source track wbr")

--- Named entities beyond XML's five: the common ones in ebooks and web pages.
local NAMED = {
    amp = "&", lt = "<", gt = ">", quot = '"', apos = "'",
    nbsp = 0xA0, shy = 0xAD, ndash = 0x2013, mdash = 0x2014, hellip = 0x2026,
    lsquo = 0x2018, rsquo = 0x2019, ldquo = 0x201C, rdquo = 0x201D, laquo = 0xAB, raquo = 0xBB,
    middot = 0xB7, iexcl = 0xA1, iquest = 0xBF, copy = 0xA9, reg = 0xAE, deg = 0xB0,
    euro = 0x20AC, thinsp = 0x2009, ensp = 0x2002, emsp = 0x2003, zwj = 0x200D, zwnj = 0x200C,
    szlig = 0xDF, aelig = 0xE6, AElig = 0xC6, oslash = 0xF8, Oslash = 0xD8, yuml = 0xFF,
}
-- Latin-1 letters: &aacute; &Ntilde; &ccedil; &ouml; ... (code points of the lowercase forms)
local LATIN1 = {
    agrave = 0xE0, aacute = 0xE1, acirc = 0xE2, atilde = 0xE3, auml = 0xE4, aring = 0xE5,
    egrave = 0xE8, eacute = 0xE9, ecirc = 0xEA, euml = 0xEB,
    igrave = 0xEC, iacute = 0xED, icirc = 0xEE, iuml = 0xEF,
    ograve = 0xF2, oacute = 0xF3, ocirc = 0xF4, otilde = 0xF5, ouml = 0xF6,
    ugrave = 0xF9, uacute = 0xFA, ucirc = 0xFB, uuml = 0xFC,
    yacute = 0xFD, ntilde = 0xF1, ccedil = 0xE7,
}
for name, cp in pairs(LATIN1) do
    NAMED[name] = cp
    NAMED[name:sub(1, 1):upper() .. name:sub(2)] = cp - 0x20
end
for name, value in pairs(NAMED) do
    if type(value) == "number" then NAMED[name] = E.encode(value) end
end

--- Stands in for an entity we cannot decode; not a letter, so it never joins a word.
local OPAQUE = E.encode(0xFFFC)

local function decode(text, opaque)
    return (text:gsub("&(#?%w+);", function(body)
        local code
        if body:match("^#%d+$") then
            code = tonumber(body:sub(2), 10)
        elseif body:match("^#[xX]%x+$") then
            code = tonumber(body:sub(3), 16)
        elseif not body:match("^%a") then
            return nil -- not an entity: the "&" is escaped later
        end
        if code and code > 0 and code <= 0x10FFFF then return E.encode(code) end
        if not code and NAMED[body] then return NAMED[body] end
        opaque[#opaque + 1] = "&" .. body .. ";"
        return OPAQUE
    end))
end

local function encode(text, opaque)
    local escaped = text:gsub("&", "&amp;"):gsub("<", "&lt;"):gsub(">", "&gt;")
    if #opaque > 0 and escaped:find(OPAQUE, 1, true) then
        escaped = escaped:gsub(OPAQUE, function() return table.remove(opaque, 1) end)
    end
    return escaped
end

local function has_letter(text)
    local cps = E.decode(text)
    for _, cp in ipairs(cps) do
        if E.is_letter(cp) then return true end
    end
    return false
end

local function local_name(qualified)
    return (qualified:match(":(.*)$") or qualified):lower()
end

-- Tag parsing, equivalent to OPEN_TAG and CLOSE_TAG in markup.ts -----------------------

local SPACE = "[ \t\n\r\f\v]"

--- Matches an opening tag at i. Returns end index, name, attributes, self-closing flag.
local function open_tag(s, i)
    local name_end = select(2, s:find("^<[A-Za-z][^%s/>]*", i))
    if not name_end then return end
    local name = s:sub(i + 1, name_end)
    local p = name_end + 1
    while true do
        local ws_end = select(2, s:find("^" .. SPACE .. "+", p))
        if not ws_end then break end
        local attr_end = select(2, s:find("^[^%s=/>]+", ws_end + 1))
        if not attr_end then break end
        local q = attr_end + 1
        local eq_end = select(2, s:find("^" .. SPACE .. "*=" .. SPACE .. "*", q))
        if eq_end then
            local v = eq_end + 1
            local c = s:sub(v, v)
            local value_end
            if c == '"' then
                value_end = s:find('"', v + 1, true)
            elseif c == "'" then
                value_end = s:find("'", v + 1, true)
            else
                value_end = select(2, s:find("^[^%s\"'=<>`]+", v))
            end
            if value_end then q = value_end + 1 end
        end
        p = q
    end
    local attributes = s:sub(name_end + 1, p - 1)
    local stop = select(2, s:find("^" .. SPACE .. "*/?>", p))
    if not stop then return end
    return stop, name, attributes, s:sub(stop - 1, stop - 1) == "/"
end

local function close_tag(s, i)
    local stop = select(2, s:find("^</[A-Za-z][^%s/>]*" .. SPACE .. "*>", i))
    if stop then return stop, s:match("^</([A-Za-z][^%s/>]*)", i) end
end

--- Equivalent of SKIP_ATTRS in markup.ts: contenteditable (unless ="false") or aria-hidden="true".
local function skip_attributes(attributes)
    local a = attributes:lower()
    local from = 1
    while true do
        local s, e = a:find("%scontenteditable", from)
        if not s then break end
        local rest = a:sub(e + 1)
        local after_eq = rest:match("^%s*=(.*)$")
        if after_eq then
            -- The regex's \s* may match no spaces, so spaces after "=" always count as a match.
            if after_eq:match("^%s") or not after_eq:match("^[\"']?false") then return true end
        elseif rest == "" or rest:match("^%s") then
            return true
        end
        from = e + 1
    end
    return a:find("%saria%-hidden%s*=%s*[\"']?true") ~= nil
end

--- Index of the closing tag of a raw-text element, case-insensitive.
local function find_close(s, name, from)
    local lower = s:lower()
    local i = from
    while true do
        local j = lower:find("</", i, true)
        if not j then return #s + 1 end
        if lower:find("^</[a-z][%w.-]*:" .. name .. SPACE .. "*>", j)
            or lower:find("^</" .. name .. SPACE .. "*>", j) then
            return j
        end
        i = j + 2
    end
end

local SPECIALS = { { "<!--", "-->" }, { "<![CDATA[", "]]>" }, { "<?", "?>" }, { "<!", ">" } }

--- Returns a stateful markup emphasizer: the `every` counter carries across calls,
--- so a book processed chapter by chapter behaves as one text.
--- `semantic` wraps bold and underline in <b>/<u> (they then show even when the
--- reader ignores the book's styles); otherwise <span class="fita-e"> as on the web.
function M.create_markup_emphasizer(options, style, semantic)
    style = style or M.DEFAULT_STYLE
    local emphasizer = E.create_emphasizer(options)
    local rest_open, rest_close = "", ""
    if style == "fade" or style == "bold-fade" then
        rest_open, rest_close = '<span class="' .. M.REST_CLASS .. '">', "</span>"
    end
    local tag = "span"
    if semantic and style == "bold" then tag = "b" end
    if semantic and style == "underline" then tag = "u" end
    local e_open, e_close = "<" .. tag .. ' class="' .. M.EMPHASIS_CLASS .. '">', "</" .. tag .. ">"

    local function text(raw)
        if not raw:find("%S") then return raw end
        local opaque = {}
        local out = {}
        for _, span in ipairs(emphasizer(decode(raw, opaque))) do
            local encoded = encode(span.text, opaque)
            if span.emphasis then
                out[#out + 1] = e_open .. encoded .. e_close
            elseif rest_open ~= "" and has_letter(span.text) then
                out[#out + 1] = rest_open .. encoded .. rest_close
            else
                out[#out + 1] = encoded
            end
        end
        return concat(out)
    end

    return function(markup)
        local out, skip = {}, {}
        local i, n = 1, #markup
        while i <= n do
            local lt = markup:find("<", i, true)
            local stop = lt or n + 1
            if stop > i then
                local chunk = markup:sub(i, stop - 1)
                out[#out + 1] = #skip > 0 and chunk or text(chunk)
                i = stop
            else
                local handled = false
                for _, sp in ipairs(SPECIALS) do
                    if markup:sub(i, i + #sp[1] - 1) == sp[1] then
                        local close = markup:find(sp[2], i, true)
                        local finish = close and close + #sp[2] - 1 or n
                        out[#out + 1] = markup:sub(i, finish)
                        i = finish + 1
                        handled = true
                        break
                    end
                end
                if not handled then
                    local close_end, close_name = close_tag(markup, i)
                    if close_end then
                        local name = local_name(close_name)
                        if #skip > 0 and skip[#skip] == name then skip[#skip] = nil end
                        out[#out + 1] = markup:sub(i, close_end)
                        i = close_end + 1
                    else
                        local open_end, name, attributes, self_closing = open_tag(markup, i)
                        if not open_end then
                            out[#out + 1] = #skip > 0 and "<" or "&lt;" -- a stray "<"
                            i = i + 1
                        else
                            out[#out + 1] = markup:sub(i, open_end)
                            i = open_end + 1
                            name = local_name(name)
                            if not (self_closing or VOID_TAGS[name]) then
                                if RAW_TEXT_TAGS[name] then
                                    local close = find_close(markup, name, i)
                                    out[#out + 1] = markup:sub(i, close - 1)
                                    i = close
                                else
                                    local skipped
                                    if #skip > 0 then
                                        skipped = skip[#skip] == name
                                    else
                                        skipped = SKIP_TAGS[name] or skip_attributes(attributes)
                                    end
                                    if skipped then skip[#skip + 1] = name end
                                end
                            end
                        end
                    end
                end
            end
        end
        return concat(out)
    end
end

--- Stylesheet for static documents (ebooks), as staticEmphasisCSS in markup.ts.
function M.static_css(style)
    local e, r = "." .. M.EMPHASIS_CLASS, "." .. M.REST_CLASS
    if style == "bold" then return e .. " { font-weight: bold; }" end
    if style == "color" then return e .. " { color: #1f5fa8; }" end
    if style == "underline" then return e .. " { text-decoration: underline; }" end
    if style == "fade" then return r .. " { opacity: 0.72; }" end
    return e .. " { font-weight: bold; }\n" .. r .. " { opacity: 0.72; }"
end

return M
