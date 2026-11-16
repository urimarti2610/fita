-- Mirrors packages/core/test/emphasize.test.ts. Run: luajit plugins/koreader/spec/run.lua
local H = require("helper")
local E = require("fita_emphasis")
local describe, it, eq, truthy = H.describe, H.it, H.eq, H.truthy

local CLASSIC = { strength = 0.4, min_word_length = 1 }

local function opts(extra)
    local o = {}
    for k, v in pairs(CLASSIC) do o[k] = v end
    for k, v in pairs(extra or {}) do o[k] = v end
    return E.resolve_options(o)
end

local function render(spans)
    local out = {}
    for _, s in ipairs(spans) do out[#out + 1] = s.emphasis and ("[" .. s.text .. "]") or s.text end
    return table.concat(out)
end

local function show(text, extra) return render(E.emphasize(text, opts(extra))) end

describe("languages", function()
    local cases = {
        { "es", "Hola, ¿qué tal estás?", "[Ho]la, ¿[q]ué [t]al [es]tás?" },
        { "es ñ", "El niño soñó", "[E]l [ni]ño [so]ñó" },
        { "ca l·l", "La col·legiala", "[L]a [col·]legiala" },
        { "ca elision", "l'àvia d'una casa", "l'[àv]ia d'[u]na [ca]sa" },
        { "ca typographic apostrophe", "L’home", "L’[ho]me" },
        { "en", "The quick brown fox", "[T]he [qu]ick [br]own [f]ox" },
        { "en contractions", "don't it's", "[do]n't [it]'s" },
        { "ru", "Съешь же ещё этих", "[Съ]ешь [ж]е [е]щё [эт]их" },
        { "pl", "Zażółć gęślą jaźń", "[Za]żółć [gę]ślą [ja]źń" },
        { "el", "Καλημέρα κόσμε", "[Καλ]ημέρα [κό]σμε" },
        { "ar", "مرحبا بالعالم", "[مر]حبا [بال]عالم" },
        { "he", "שלום עולם", "[של]ום [עו]לם" },
    }
    for _, c in ipairs(cases) do
        it(c[1], function() eq(show(c[2]), c[3]) end)
    end
    it("leaves Chinese, Japanese, Thai, Lao, Khmer and Myanmar untouched", function()
        for _, t in ipairs({ "你好世界", "こんにちは世界、カタカナ", "ภาษาไทย", "ພາສາລາວ", "ភាសាខ្មែរ", "မြန်မာဘာသာ" }) do
            eq(show(t), t)
        end
    end)
    it("processes Latin mixed with CJK", function() eq(show("你好 hello"), "你好 [he]llo") end)
    it("keeps RTL text in logical order", function()
        local spans = E.emphasize("שלום עולם", opts())
        eq(spans[1].text, "של")
        eq(spans[1].emphasis, true)
    end)
end)

describe("defaults", function()
    it("bold most of long words", function()
        eq(render(E.emphasize("Es casi insultantemente simple. Y quizá funciona precisamente por eso")),
            "[E]s [ca]si [insulta]ntemente [sim]ple. [Y] [qu]izá [func]iona [preci]samente [p]or [e]so")
    end)
end)

describe("graphemes", function()
    it("never splits emoji or combining sequences", function()
        eq(show("I ❤️ 👩‍👩‍👧 café"), "[I] ❤️ 👩‍👩‍👧 [ca]fé")
        eq(show("ñ̃e̊xamp"), "[ñ̃e̊]xamp")
        eq(show("e\204\129s"), "[e\204\129]s")
    end)
    it("does not split ligatures", function() eq(show("ﬁnd"), "[ﬁ]nd") end)
    it("keeps Indic conjuncts whole", function() eq(show("हिन्दी"), "[हि]न्दी") end)
end)

describe("rules", function()
    it("emphasizes at least one grapheme and leaves one plain", function()
        eq(E.emphasis_count(1, E.resolve_options()), 1)
        eq(E.emphasis_count(2, E.resolve_options({ strength = 0.7 })), 1)
        eq(E.emphasis_count(10, E.resolve_options({ strength = 0.7 })), 7)
        eq(E.emphasis_count(10, E.resolve_options({ strength = 0.2 })), 2)
        eq(E.emphasis_count(0, E.resolve_options()), 0)
        eq(E.emphasis_count(10, E.resolve_options({ strength = 0.45 })), 5)
    end)
    it("minWordLength", function()
        eq(show("casa elefante", { min_word_length = 5, strength = 0.7 }), "[c]asa [elefan]te")
    end)
    it("every", function() eq(show("uno dos 3 tres cuatro", { every = 2 }), "[u]no dos 3 [tr]es cuatro") end)
    it("carries every across chunks", function()
        local run = E.create_emphasizer(opts({ every = 2 }))
        local a = run("uno dos")
        local b = run("tres cuatro")
        eq(a[1].emphasis, true)
        eq(a[2].emphasis, false)
        eq(b[1].text, "tr")
    end)
    it("clamps options", function()
        eq(E.resolve_options({ strength = 5 }).strength, 0.7)
        eq(E.resolve_options({ strength = -1 }).strength, 0.2)
        eq(E.resolve_options({ strength = 0 / 0 }).strength, 0.45)
        eq(E.resolve_options({ every = 0 }).every, 1)
        eq(E.resolve_options({ min_word_length = 2.7 }).min_word_length, 2)
    end)
end)

describe("numbers", function()
    it("skips numbers", function()
        eq(show("Año 2024, 3D y 1.000"), "[A]ño 2024, 3D [y] 1.000")
        eq(show("٣٤٥ mil"), "٣٤٥ [m]il")
    end)
    it("processes them when asked", function()
        eq(show("12345 3Dmax", { skip_numbers = false }), "[12]345 [3D]max")
    end)
end)

describe("protected text", function()
    for _, t in ipairs({ "https://example.com/path?q=1", "http://ejemplo.cat", "www.example.org/page",
        "persona@example.com", "nom.cognom@domini.cat", "/usr/local/bin", "./src/index.ts",
        "~/Documents/libro.epub", "C:\\Users\\docs", "`npm install`", "foo()", "console.log(x)",
        "snake_case_name" }) do
        it(t, function() eq(show("palabra " .. t .. " palabra"), "[pal]abra " .. t .. " [pal]abra") end)
    end
    it("prose with slashes", function() eq(show("and/or amigo(a)"), "[a]nd/[o]r [am]igo([a])") end)
end)

describe("edge cases", function()
    it("empty", function()
        eq(#E.emphasize(""), 0)
        local s = E.emphasize("  \n\t")
        eq(#s, 1)
        eq(s[1].text, "  \n\t")
    end)
    it("round-trips text, including invalid UTF-8", function()
        local text = "Mixed: café 你好 שלום 👩‍👩‍👧 https://x.y/z l'àvia\r\n2024 — ok\194\173 bad\255byte"
        local out = {}
        for _, s in ipairs(E.emphasize(text, opts())) do out[#out + 1] = s.text end
        eq(table.concat(out), text)
    end)
    it("processes 5 MB of text in reasonable time", function()
        local p = "Lorem ipsum dolor sit amet, l'àvia col·leccionava llibres. Съешь же ещё этих мягких булок. "
        local text = p:rep(math.ceil(5 * 1024 * 1024 / #p))
        local start = os.clock()
        local spans = E.emphasize(text)
        truthy(#spans > 100000)
        local total = 0
        for _, s in ipairs(spans) do total = total + #s.text end
        eq(total, #text)
        truthy(os.clock() - start < 60, "too slow: " .. (os.clock() - start))
    end)
end)

describe("shared fixtures", function()
    it("match the TypeScript core", function()
        local cases = H.json(H.read(H.root .. "../fixtures/emphasis.json"))
        truthy(#cases > 100)
        local names = { strength = "strength", minWordLength = "min_word_length", every = "every",
            skipNumbers = "skip_numbers" }
        for _, c in ipairs(cases) do
            local o = {}
            for k, v in pairs(c.options) do o[names[k]] = v end
            eq(render(E.emphasize(c.text, E.resolve_options(o))), c.expected, c.text)
        end
    end)
end)
