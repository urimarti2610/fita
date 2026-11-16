-- Mirrors packages/core/test/markup.test.ts.
local H = require("helper")
local E = require("fita_emphasis")
local Mk = require("fita_markup")
local describe, it, eq = H.describe, H.it, H.eq

local function opts(extra)
    local o = { strength = 0.4, min_word_length = 1 }
    for k, v in pairs(extra or {}) do o[k] = v end
    return E.resolve_options(o)
end
local function run(markup, style, extra, semantic)
    return Mk.create_markup_emphasizer(opts(extra), style or "bold", semantic)(markup)
end
local function Em(s) return '<span class="fita-e">' .. s .. "</span>" end

describe("markup", function()
    it("keeps tags and attributes byte for byte", function()
        eq(run([[<p class="x" data-a='1>2'>Hola <a href="/m?a=1&amp;b">mundo</a></p>]]),
            [[<p class="x" data-a='1>2'>]] .. Em("Ho") .. [[la <a href="/m?a=1&amp;b">]] .. Em("mu") .. "ndo</a></p>")
    end)

    it("keeps the text content", function()
        local xhtml = '<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE html>\n'
            .. '<html xmlns="http://www.w3.org/1999/xhtml"><head><title>Títol</title><style>p{}</style></head>'
            .. "<body><p>L&apos;àvia &amp; el nét &lt;3 &#233;s &#xe9;s</p><!-- comentari --></body></html>"
        local out = run(xhtml)
        H.truthy(out:find("<title>Títol</title>", 1, true))
        H.truthy(out:find("<!-- comentari -->", 1, true))
        H.truthy(out:find("L'" .. Em("àv") .. "ia &amp; ", 1, true))
        H.truthy(out:find(Em("é") .. "s " .. Em("é") .. "s", 1, true))
    end)

    it("decodes entities inside words", function()
        eq(run("<p>caf&eacute; Espa&ntilde;a &Ccedil;a</p>"), "<p>" .. Em("ca") .. "fé " .. Em("Es") .. "paña " .. Em("Ç") .. "a</p>")
    end)

    it("preserves unknown entities and escapes non-entities", function()
        eq(run("<p>a&foo;b palabra</p>"), "<p>" .. Em("a") .. "&foo;" .. Em("b") .. " " .. Em("pal") .. "abra</p>")
        eq(run("<p>R&#xyz; x</p>"), "<p>" .. Em("R") .. "&amp;#" .. Em("x") .. "yz; " .. Em("x") .. "</p>")
    end)

    it("skips code, pre, raw-text and marked elements", function()
        for _, html in ipairs({
            "<pre>texto <b>pre</b></pre>", "<code>x &lt; y</code>", "<script>if (a < b) { texto() }</script>",
            "<SCRIPT>a<b</SCRIPT>", "<style>p > a { }</style>", "<textarea>texto</textarea>",
            "<svg:svg><svg:text>gráfico</svg:text></svg:svg>", "<math><mi>x</mi></math>",
            '<div contenteditable="true">edit <div>nested</div> still</div>', "<div contenteditable>edit</div>",
            '<span aria-hidden="true">oculto</span>', "<pre>a<pre>b</pre>c</pre>", "<![CDATA[ texto ]]>",
            "<?pi texto?>",
        }) do
            eq(run(html), html)
        end
        H.truthy(run('<div contenteditable="false">texto</div>'):find(Em("te"), 1, true))
    end)

    it("returns to normal after a skipped element", function()
        eq(run("<pre>no</pre><p>sí</p>"), "<pre>no</pre><p>" .. Em("s") .. "í</p>")
    end)

    it("handles void and self-closing tags", function()
        eq(run("<p>uno<br>dos<img src=a.png/><hr/>tres</p>"),
            "<p>" .. Em("u") .. "no<br>" .. Em("d") .. "os<img src=a.png/><hr/>" .. Em("tr") .. "es</p>")
    end)

    it("escapes a stray <", function()
        eq(run("<p>1 < 2 y más</p>"), "<p>1 &lt; 2 " .. Em("y") .. " " .. Em("m") .. "ás</p>")
    end)

    it("copies unterminated comments and raw elements", function()
        eq(run("<p>hola</p><!-- sin cerrar"), "<p>" .. Em("ho") .. "la</p><!-- sin cerrar")
        eq(run("<script>sin cerrar"), "<script>sin cerrar")
    end)

    it("carries every across calls", function()
        local f = Mk.create_markup_emphasizer(opts({ every = 2 }), "bold")
        eq(f("<p>uno dos</p>"), "<p>" .. Em("u") .. "no dos</p>")
        eq(f("<p>tres cuatro</p>"), "<p>" .. Em("tr") .. "es cuatro</p>")
    end)

    it("wraps the rest for the fade style", function()
        eq(run("<p>Hola, mundo</p>", "fade"), "<p>" .. Em("Ho") .. '<span class="fita-r">la, </span>'
            .. Em("mu") .. '<span class="fita-r">ndo</span></p>')
    end)

    it("defaults to bold start and faded rest", function()
        eq(Mk.create_markup_emphasizer()("<p>lectura</p>"), "<p>" .. Em("lec") .. '<span class="fita-r">tura</span></p>')
    end)

    it("uses <b> and <u> in semantic mode", function()
        eq(run("<p>hola</p>", "bold", nil, true), '<p><b class="fita-e">ho</b>la</p>')
        eq(run("<p>hola</p>", "underline", nil, true), '<p><u class="fita-e">ho</u>la</p>')
        eq(run("<p>hola</p>", "color", nil, true), "<p>" .. Em("ho") .. "la</p>")
    end)

    it("leaves whitespace-only text alone", function()
        eq(run("<ul>\n  <li>a</li>\n</ul>"), "<ul>\n  <li>" .. Em("a") .. "</li>\n</ul>")
    end)

    it("has the same CSS as the web converter", function()
        eq(Mk.static_css("bold-fade"), ".fita-e { font-weight: bold; }\n.fita-r { opacity: 0.72; }")
        eq(Mk.static_css("color"), ".fita-e { color: #1f5fa8; }")
        eq(Mk.static_css("underline"), ".fita-e { text-decoration: underline; }")
    end)
end)
