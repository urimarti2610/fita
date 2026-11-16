--[[
Which part of each word to emphasize: a Lua port of packages/core/src/emphasize.ts.

Pure Lua 5.1 / LuaJIT, no KOReader dependency, so it runs in plain `luajit`
for the tests. Lua has no Unicode support, so character classes come from
fita_unicode.lua, generated from the calibre plugin's Python engine: both
ports segment words (UAX #29, as ICU does) and graphemes the same way, and
the shared fixtures in plugins/fixtures/emphasis.json keep them identical to
the TypeScript core.
]]

local U = require("fita_unicode")
local C = U.classes
local floor = math.floor
local byte, char, concat = string.byte, string.char, table.concat

local M = {}

M.MIN_STRENGTH = 0.2
M.MAX_STRENGTH = 0.7
M.DEFAULTS = { strength = 0.45, min_word_length = 4, every = 1, skip_numbers = true }

local function number(value, fallback)
    if type(value) ~= "number" or value ~= value or value == math.huge or value == -math.huge then
        return fallback
    end
    return value
end

--- Validates and fills in defaults. Out-of-range values are clamped, never rejected.
function M.resolve_options(o)
    o = o or {}
    local d = M.DEFAULTS
    local skip = o.skip_numbers
    if skip == nil then skip = d.skip_numbers end
    return {
        strength = math.min(M.MAX_STRENGTH, math.max(M.MIN_STRENGTH, number(o.strength, d.strength))),
        min_word_length = math.max(1, floor(number(o.min_word_length, d.min_word_length))),
        every = math.max(1, floor(number(o.every, d.every))),
        skip_numbers = skip and true or false,
    }
end

--- How many leading graphemes of a word of `length` graphemes to emphasize.
function M.emphasis_count(length, options)
    if length <= 0 then return 0 end
    if length < options.min_word_length then return 1 end
    local n = math.max(1, floor(length * options.strength + 0.5)) -- JavaScript's Math.round
    if length >= 2 then return math.min(n, length - 1) end
    return n
end

-- Unicode data -----------------------------------------------------------------

local starts, values = U.starts, U.values
local cache = {}

local function info(cp)
    local v = cache[cp]
    if v then return v end
    local lo, hi = 1, #starts
    while lo < hi do
        local mid = floor((lo + hi + 1) / 2)
        if starts[mid] <= cp then lo = mid else hi = mid - 1 end
    end
    v = values[lo]
    cache[cp] = v
    return v
end
local function wclass(cp) return info(cp) % 16 end
local function flag(cp, bit) return floor(info(cp) / bit) % 2 == 1 end
local function is_letter(cp) return flag(cp, 64) end
local function is_number(cp) return flag(cp, 128) end
local function is_space(cp) return flag(cp, 256) end
M.is_letter = is_letter

--- Decodes UTF-8 into code points and the byte offset of each one (offsets[n + 1] = #s + 1).
--- Invalid bytes decode as U+FFFD, one byte each, and are copied through unchanged.
function M.decode(s)
    local cps, offsets = {}, {}
    local i, n, len = 1, 0, #s
    while i <= len do
        local c = byte(s, i)
        local cp, size = 0xFFFD, 1
        if c < 0x80 then
            cp = c
        elseif c >= 0xC2 and c < 0xE0 and i + 1 <= len then
            local c2 = byte(s, i + 1)
            if c2 >= 0x80 and c2 < 0xC0 then cp, size = (c - 0xC0) * 64 + (c2 - 0x80), 2 end
        elseif c >= 0xE0 and c < 0xF0 and i + 2 <= len then
            local c2, c3 = byte(s, i + 1, i + 2)
            if c2 >= 0x80 and c2 < 0xC0 and c3 >= 0x80 and c3 < 0xC0 then
                cp, size = (c - 0xE0) * 4096 + (c2 - 0x80) * 64 + (c3 - 0x80), 3
            end
        elseif c >= 0xF0 and c < 0xF5 and i + 3 <= len then
            local c2, c3, c4 = byte(s, i + 1, i + 3)
            if c2 >= 0x80 and c2 < 0xC0 and c3 >= 0x80 and c3 < 0xC0 and c4 >= 0x80 and c4 < 0xC0 then
                cp, size = (c - 0xF0) * 262144 + (c2 - 0x80) * 4096 + (c3 - 0x80) * 64 + (c4 - 0x80), 4
            end
        end
        n = n + 1
        cps[n] = cp
        offsets[n] = i
        i = i + size
    end
    offsets[n + 1] = len + 1
    return cps, offsets
end

--- Encodes one code point as UTF-8.
function M.encode(cp)
    if cp < 0x80 then return char(cp) end
    if cp < 0x800 then return char(0xC0 + floor(cp / 64), 0x80 + cp % 64) end
    if cp < 0x10000 then
        return char(0xE0 + floor(cp / 4096), 0x80 + floor(cp / 64) % 64, 0x80 + cp % 64)
    end
    return char(0xF0 + floor(cp / 262144), 0x80 + floor(cp / 4096) % 64,
        0x80 + floor(cp / 64) % 64, 0x80 + cp % 64)
end

--- Scripts written without spaces between words: Han, Hiragana, Katakana, Thai, Lao, Khmer, Myanmar.
local NO_SPACE_RANGES = {
    { 0x0E00, 0x0E7F }, { 0x0E80, 0x0EFF }, { 0x1000, 0x109F }, { 0x1780, 0x17FF },
    { 0x19E0, 0x19FF }, { 0x2E80, 0x2FDF }, { 0x3005, 0x3007 }, { 0x3021, 0x3029 },
    { 0x3038, 0x303B }, { 0x3041, 0x309F }, { 0x30A1, 0x30FA }, { 0x30FD, 0x30FF },
    { 0x31F0, 0x31FF }, { 0x32D0, 0x32FE }, { 0x3300, 0x3357 }, { 0x3400, 0x4DBF },
    { 0x4E00, 0x9FFF }, { 0xA9E0, 0xA9FF }, { 0xAA60, 0xAA7F }, { 0xF900, 0xFAFF },
    { 0xFF66, 0xFF6F }, { 0xFF71, 0xFF9D }, { 0x1B000, 0x1B16F }, { 0x20000, 0x323AF },
}
local function in_ranges(cp, ranges)
    for _, r in ipairs(ranges) do
        if cp < r[1] then return false end
        if cp <= r[2] then return true end
    end
    return false
end

-- Word segmentation (UAX #29, as ICU) ------------------------------------------

local WORD_START = { [C.LETTER] = true, [C.HEBREW] = true, [C.NUMERIC] = true,
    [C.KATAKANA] = true, [C.HANGUL] = true }
local LETTERS = { [C.LETTER] = true, [C.HEBREW] = true }
local function set(...)
    local t = {}
    for _, v in ipairs({ ... }) do t[v] = true end
    return t
end
local ALNUM_ENL = set(C.LETTER, C.HEBREW, C.NUMERIC, C.EXTEND_NUM_LET)
local JOINS = {
    [C.LETTER] = ALNUM_ENL,
    [C.HEBREW] = ALNUM_ENL,
    [C.NUMERIC] = ALNUM_ENL,
    [C.KATAKANA] = set(C.KATAKANA, C.EXTEND_NUM_LET),
    [C.HANGUL] = set(C.HANGUL),
    [C.EXTEND_NUM_LET] = set(C.LETTER, C.HEBREW, C.NUMERIC, C.KATAKANA, C.EXTEND_NUM_LET),
}
local EMPTY = {}
local MID_LETTERS = set(C.MID_LETTER, C.MID_NUM_LET, C.SINGLE_QUOTE)
local MID_NUMS = set(C.MID_NUM, C.MID_NUM_LET, C.SINGLE_QUOTE)

local function skip_extend(cps, i, n)
    while i <= n and wclass(cps[i]) == C.EXTEND do i = i + 1 end
    return i
end

--- Index after the word starting at `start`.
local function word_end(cps, start, n)
    local last = wclass(cps[start])
    local i = start + 1
    while true do
        i = skip_extend(cps, i, n)
        if i > n then return i end
        local c = wclass(cps[i])
        if (JOINS[last] or EMPTY)[c] then
            last = c
            i = i + 1
        else
            local nxt = skip_extend(cps, i + 1, n)
            local after = nxt <= n and wclass(cps[nxt]) or C.OTHER
            if LETTERS[last] and MID_LETTERS[c] and LETTERS[after] then -- WB6, WB7
                i = nxt
            elseif last == C.NUMERIC and MID_NUMS[c] and after == C.NUMERIC then -- WB11, WB12
                i = nxt
            elseif last == C.HEBREW and c == C.DOUBLE_QUOTE and after == C.HEBREW then -- WB7b, WB7c
                i = nxt
            elseif last == C.HEBREW and c == C.SINGLE_QUOTE then -- WB7a
                return nxt
            else
                return i
            end
        end
    end
end

--- Calls visit(first, last, is_word) for consecutive segments of cps[from..to].
local function segment_words(cps, from, to, visit)
    local i, other = from, from
    while i <= to do
        local start_class = wclass(cps[i])
        if WORD_START[start_class] then
            -- WB13b: connectors and narrow no-break spaces join the word that follows.
            local j = i
            if JOINS[C.EXTEND_NUM_LET][start_class] then
                while j > other do
                    local k = j - 1
                    while k > other and wclass(cps[k]) == C.EXTEND do k = k - 1 end
                    if wclass(cps[k]) ~= C.EXTEND_NUM_LET then break end
                    j = k
                end
            end
            if other < j then visit(other, j - 1, false) end
            local e = word_end(cps, i, to)
            visit(j, e - 1, true)
            i, other = e, e
        else
            i = i + 1
        end
    end
    if other <= to then visit(other, to, false) end
end

-- Grapheme clusters --------------------------------------------------------------

local function hangul(cp)
    if (cp >= 0x1100 and cp <= 0x115F) or (cp >= 0xA960 and cp <= 0xA97C) then return "L" end
    if (cp >= 0x1160 and cp <= 0x11A7) or (cp >= 0xD7B0 and cp <= 0xD7C6) then return "V" end
    if (cp >= 0x11A8 and cp <= 0x11FF) or (cp >= 0xD7CB and cp <= 0xD7FB) then return "T" end
    if cp >= 0xAC00 and cp <= 0xD7A3 then
        return (cp - 0xAC00) % 28 == 0 and "LV" or "LVT"
    end
    return ""
end

local function is_mark(cp)
    return flag(cp, 16) and cp ~= 0x200C and cp ~= 0x200D and not (cp >= 0x1F3FB and cp <= 0x1F3FF)
end

--- True when there is no grapheme boundary between prev and cp.
local function grapheme_extends(prev, cp)
    if prev == 13 and cp == 10 then return true end
    if cp == 0x200C or cp == 0x200D or (cp >= 0x1F3FB and cp <= 0x1F3FF) then return true end
    if is_mark(cp) then return prev ~= 13 and prev ~= 10 end
    if prev == 0x200D then return flag(cp, 32) end -- emoji ZWJ sequences
    if prev >= 0x1F1E6 and prev <= 0x1F1FF and cp >= 0x1F1E6 and cp <= 0x1F1FF then return true end
    local a, b = hangul(prev), hangul(cp)
    return (a == "L" and (b == "L" or b == "V" or b == "LV" or b == "LVT"))
        or ((a == "LV" or a == "V") and (b == "V" or b == "T"))
        or ((a == "LVT" or a == "T") and b == "T")
end

--- Indic conjuncts (Unicode 15.1, GB9c).
local INCB_LINKERS = set(0x094D, 0x09CD, 0x0ACD, 0x0B4D, 0x0C4D, 0x0D4D)
local INCB_CONSONANTS = {
    { 0x0915, 0x0939 }, { 0x0958, 0x095F }, { 0x0978, 0x097F },
    { 0x0995, 0x09A8 }, { 0x09AA, 0x09B0 }, { 0x09B2, 0x09B2 }, { 0x09B6, 0x09B9 },
    { 0x09DC, 0x09DD }, { 0x09DF, 0x09DF }, { 0x09F0, 0x09F1 },
    { 0x0A95, 0x0AA8 }, { 0x0AAA, 0x0AB0 }, { 0x0AB2, 0x0AB3 }, { 0x0AB5, 0x0AB9 }, { 0x0AF9, 0x0AF9 },
    { 0x0B15, 0x0B28 }, { 0x0B2A, 0x0B30 }, { 0x0B32, 0x0B33 }, { 0x0B35, 0x0B39 },
    { 0x0B5C, 0x0B5D }, { 0x0B5F, 0x0B5F }, { 0x0B71, 0x0B71 },
    { 0x0C15, 0x0C28 }, { 0x0C2A, 0x0C39 }, { 0x0C58, 0x0C5A },
    { 0x0D15, 0x0D3A },
}

--- Indices (into cps) where each grapheme of cps[from..to] starts.
local function grapheme_starts(cps, from, to)
    local out = {}
    local regional, conjunct = 0, 0
    for i = from, to do
        local cp = cps[i]
        local is_regional = cp >= 0x1F1E6 and cp <= 0x1F1FF
        local joined = i > from and grapheme_extends(cps[i - 1], cp)
        if is_regional and joined then joined = regional % 2 == 1 end
        local consonant = in_ranges(cp, INCB_CONSONANTS)
        if consonant and conjunct == 2 then joined = true end
        if not joined then out[#out + 1] = i end
        regional = is_regional and regional + 1 or 0
        if consonant then
            conjunct = 1
        elseif conjunct > 0 and INCB_LINKERS[cp] then
            conjunct = 2
        elseif conjunct > 0 and not (grapheme_extends(97, cp) or cp == 0x200D) then
            conjunct = 0
        end
    end
    return out
end

-- Protected text: URLs, emails, paths and code ---------------------------------------
-- Hand-written matchers equivalent to PROTECTED in emphasize.ts, tried in the same
-- order at each position (leftmost match first, then first alternative).

local BACKTICK, NL, COLON, SLASH, BACKSLASH = 96, 10, 58, 47, 92
local LPAREN, RPAREN, AT, DOT, TILDE, UNDERSCORE, DOLLAR = 40, 41, 64, 46, 126, 95, 36

local function ascii_letter(cp) return cp and ((cp >= 65 and cp <= 90) or (cp >= 97 and cp <= 122)) end
local function ascii_word(cp) return cp and (ascii_letter(cp) or (cp >= 48 and cp <= 57) or cp == UNDERSCORE) end
local function ln(cp) return cp and (is_letter(cp) or is_number(cp)) end
local function boundary(cps, i) return not ascii_word(cps[i - 1]) end -- JavaScript's ASCII \b
local function url_char(cp) -- [^\s<>"]
    return cp and not is_space(cp) and cp ~= 60 and cp ~= 62 and cp ~= 34
end
local function run(cps, i, n, test)
    while i <= n and test(cps[i]) do i = i + 1 end
    return i
end
local function lower(cp) return (cp >= 65 and cp <= 90) and cp + 32 or cp end

local function inline_code(cps, i, n)
    if cps[i] ~= BACKTICK then return end
    local j = run(cps, i + 1, n, function(cp) return cp ~= BACKTICK and cp ~= NL end)
    if j > i + 1 and cps[j] == BACKTICK then return j + 1 end
end

local function scheme_url(cps, i, n)
    if not ascii_letter(cps[i]) or not boundary(cps, i) then return end
    local j = run(cps, i + 1, n, function(cp)
        return ascii_letter(cp) or (cp >= 48 and cp <= 57) or cp == 43 or cp == DOT or cp == 45
    end)
    if cps[j] == COLON and cps[j + 1] == SLASH and cps[j + 2] == SLASH and url_char(cps[j + 3]) then
        return run(cps, j + 3, n, url_char)
    end
end

local function www(cps, i, n)
    if not boundary(cps, i) then return end
    for k = 0, 2 do if lower(cps[i + k] or 0) ~= 119 then return end end
    if cps[i + 3] == DOT and url_char(cps[i + 4]) then return run(cps, i + 4, n, url_char) end
end

local function email(cps, i, n)
    local j = run(cps, i, n, function(cp)
        return ln(cp) or cp == DOT or cp == UNDERSCORE or cp == 37 or cp == 43 or cp == 45
    end)
    if j == i or cps[j] ~= AT then return end
    local function label(cp) return ln(cp) or cp == 45 end
    local k = run(cps, j + 1, n, label)
    if k == j + 1 then return end
    local finish
    while cps[k] == DOT and label(cps[k + 1]) do
        k = run(cps, k + 1, n, label)
        finish = k
    end
    return finish
end

local function path_char(cp) return ln(cp) or cp == DOT or cp == UNDERSCORE or cp == 45 end
local function unix_path(cps, i, n)
    if ln(cps[i - 1]) then return end
    local p = i
    if cps[p] == TILDE then
        p = p + 1
    elseif cps[p] == DOT then
        if cps[p + 1] == DOT and cps[p + 2] == SLASH then p = p + 2
        elseif cps[p + 1] == SLASH then p = p + 1
        else return end
    end
    if cps[p] ~= SLASH then return end
    local q = run(cps, p + 1, n, path_char)
    if q == p + 1 or cps[q] ~= SLASH then return end
    while cps[q] == SLASH do q = run(cps, q + 1, n, path_char) end
    return q
end

local function windows_path(cps, i, n)
    if not ascii_letter(cps[i]) or not boundary(cps, i) then return end
    if cps[i + 1] == COLON and cps[i + 2] == BACKSLASH and url_char(cps[i + 3]) then
        return run(cps, i + 3, n, url_char)
    end
end

local function ident_start(cp) return cp and (is_letter(cp) or cp == UNDERSCORE or cp == DOLLAR) end
local function ident_char(cp) return ident_start(cp) or (cp and is_number(cp)) end

local function method_call(cps, i, n) -- a.b(x)
    if not ident_start(cps[i]) then return end
    local j = run(cps, i + 1, n, ident_char)
    local reps = 0
    while cps[j] == DOT and ident_start(cps[j + 1]) do
        j = run(cps, j + 2, n, ident_char)
        reps = reps + 1
    end
    if reps == 0 or cps[j] ~= LPAREN then return end
    local k = run(cps, j + 1, n, function(cp) return cp ~= LPAREN and cp ~= RPAREN and not is_space(cp) end)
    if cps[k] == RPAREN then return k + 1 end
end

local function call(cps, i, n) -- call()
    if not ident_start(cps[i]) then return end
    local j = run(cps, i + 1, n, ident_char)
    if cps[j] == LPAREN and cps[j + 1] == RPAREN then return j + 2 end
end

local function snake_case(cps, i, n)
    local j = run(cps, i, n, ln)
    if cps[j] ~= UNDERSCORE then return end
    local k = run(cps, j + 1, n, function(cp) return ln(cp) or cp == UNDERSCORE end)
    if k > j + 1 then return k end
end

local MATCHERS = { inline_code, scheme_url, www, email, unix_path, windows_path, method_call, call, snake_case }

--- Calls visit(first, last, protected) over cps[1..n].
local function protected_ranges(s, cps, n, visit)
    local maybe = s:find("[`:/@\\(_]") or s:lower():find("www.", 1, true)
    local last = 1
    if maybe then
        local i = 1
        while i <= n do
            local stop
            for _, matcher in ipairs(MATCHERS) do
                stop = matcher(cps, i, n)
                if stop then break end
            end
            if stop then
                if last < i then visit(last, i - 1, false) end
                visit(i, stop - 1, true)
                i, last = stop, stop
            else
                i = i + 1
            end
        end
    end
    if last <= n then visit(last, n, false) end
end

-- Emphasis -------------------------------------------------------------------------

local APOSTROPHES = set(39, 0x2019)

--- Returns a stateful emphasizer: the `every` counter carries over between calls,
--- so a document processed in pieces behaves like one text. It returns a list of
--- { text = string, emphasis = boolean } spans that concatenate to the input.
function M.create_emphasizer(options)
    local opts = options or M.resolve_options()
    local processable = 0

    return function(s)
        local cps, offsets = M.decode(s)
        local n = #cps
        local spans = {}

        local function push(first, last, emphasis)
            if first > last then return end
            local text = s:sub(offsets[first], offsets[last + 1] - 1)
            local prev = spans[#spans]
            if prev and prev.emphasis == emphasis then
                prev.parts[#prev.parts + 1] = text
            else
                spans[#spans + 1] = { parts = { text }, emphasis = emphasis }
            end
        end

        local function word(first, last)
            for k = first, last do
                local cp = cps[k]
                if (opts.skip_numbers and wclass(cp) == C.NUMERIC) or in_ranges(cp, NO_SPACE_RANGES) then
                    return push(first, last, false)
                end
            end
            local index = processable
            processable = processable + 1
            if index % opts.every ~= 0 then return push(first, last, false) end
            -- Skip a short elided prefix (l'àvia, d'una) so the anchor falls on the main word.
            local body = first
            local letters = 0
            while letters < 2 and first + letters <= last and is_letter(cps[first + letters]) do
                letters = letters + 1
            end
            for count = letters, 1, -1 do
                if APOSTROPHES[cps[first + count]] then
                    if #grapheme_starts(cps, first + count + 1, last) >= 3 then body = first + count + 1 end
                    break
                end
            end
            local starts_ = grapheme_starts(cps, body, last)
            local count = M.emphasis_count(#starts_, opts)
            local cut = starts_[count + 1] or last + 1
            push(first, body - 1, false)
            push(body, cut - 1, true)
            push(cut, last, false)
        end

        local function plain(first, last)
            segment_words(cps, first, last, function(a, b, is_word)
                if is_word then word(a, b) else push(a, b, false) end
            end)
        end

        protected_ranges(s, cps, n, function(a, b, is_protected)
            if is_protected then push(a, b, false) else plain(a, b) end
        end)

        for k, span in ipairs(spans) do
            spans[k] = { text = concat(span.parts), emphasis = span.emphasis }
        end
        return spans
    end
end

--- Splits `text` into emphasized and plain spans that concatenate to `text`.
function M.emphasize(text, options)
    return M.create_emphasizer(options)(text)
end

return M
