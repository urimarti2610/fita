"""Mirrors packages/core/test/markup.test.ts."""

import os
import re
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "plugin"))

from engine.emphasis import resolve_options  # noqa: E402
from engine.markup import STYLES, create_markup_emphasizer, static_emphasis_css  # noqa: E402

CLASSIC = dict(strength=0.4, min_word_length=1)


def E(s):
    return f'<span class="fita-e">{s}</span>'


def run(markup, style="bold", **options):
    return create_markup_emphasizer(resolve_options(**{**CLASSIC, **options}), style)(markup)


class MarkupEmphasizer(unittest.TestCase):
    def test_keeps_tags_byte_for_byte(self):
        self.assertEqual(
            run("<p class=\"x\" data-a='1>2'>Hola <a href=\"/m?a=1&amp;b\">mundo</a></p>"),
            f"<p class=\"x\" data-a='1>2'>{E('Ho')}la <a href=\"/m?a=1&amp;b\">{E('mu')}ndo</a></p>",
        )

    def test_text_content_unchanged(self):
        xhtml = (
            '<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE html>\n'
            '<html xmlns="http://www.w3.org/1999/xhtml"><head><title>Títol</title>'
            "<style>p{}</style></head><body><p>L&apos;àvia &amp; el nét &lt;3 &#233;s &#xe9;s</p>"
            "<!-- comentari --></body></html>"
        )
        out = run(xhtml)

        def strip(s):
            s = re.sub(r"<[^>]+>", "", s).replace("&apos;", "'")
            return re.sub(r"&#x?[\da-f]+;", "é", s, flags=re.I)

        self.assertEqual(strip(out), strip(xhtml))
        self.assertIn("<title>Títol</title>", out)
        self.assertIn("<!-- comentari -->", out)
        self.assertIn(f"L'{E('àv')}ia &amp; ", out)

    def test_decodes_entities_inside_words(self):
        self.assertEqual(
            run("<p>caf&eacute; Espa&ntilde;a &Ccedil;a</p>"),
            f"<p>{E('ca')}fé {E('Es')}paña {E('Ç')}a</p>",
        )

    def test_unknown_entities(self):
        self.assertEqual(
            run("<p>a&foo;b palabra</p>"), f"<p>{E('a')}&foo;{E('b')} {E('pal')}abra</p>"
        )

    def test_skipped_elements(self):
        for html in [
            "<pre>texto <b>pre</b></pre>",
            "<code>x &lt; y</code>",
            "<script>if (a < b) { texto() }</script>",
            "<SCRIPT>a<b</SCRIPT>",
            "<style>p > a { }</style>",
            "<textarea>texto</textarea>",
            "<svg:svg><svg:text>gráfico</svg:text></svg:svg>",
            "<math><mi>x</mi></math>",
            '<div contenteditable="true">edit <div>nested</div> still</div>',
            "<div contenteditable>edit</div>",
            '<span aria-hidden="true">oculto</span>',
            "<pre>a<pre>b</pre>c</pre>",
            "<![CDATA[ texto ]]>",
            "<?pi texto?>",
        ]:
            with self.subTest(html):
                self.assertEqual(run(html), html)
        self.assertIn(E("te"), run('<div contenteditable="false">texto</div>'))

    def test_after_skipped_element(self):
        self.assertEqual(run("<pre>no</pre><p>sí</p>"), f"<pre>no</pre><p>{E('s')}í</p>")

    def test_void_and_self_closing(self):
        self.assertEqual(
            run("<p>uno<br>dos<img src=a.png/><hr/>tres</p>"),
            f"<p>{E('u')}no<br>{E('d')}os<img src=a.png/><hr/>{E('tr')}es</p>",
        )

    def test_stray_lt(self):
        self.assertEqual(run("<p>1 < 2 y más</p>"), f"<p>1 &lt; 2 {E('y')} {E('m')}ás</p>")

    def test_unterminated(self):
        self.assertEqual(run("<p>hola</p><!-- sin cerrar"), f"<p>{E('ho')}la</p><!-- sin cerrar")
        self.assertEqual(run("<script>sin cerrar"), "<script>sin cerrar")

    def test_every_across_calls(self):
        emphasize = create_markup_emphasizer(resolve_options(**CLASSIC, every=2), "bold")
        self.assertEqual(emphasize("<p>uno dos</p>"), f"<p>{E('u')}no dos</p>")
        self.assertEqual(emphasize("<p>tres cuatro</p>"), f"<p>{E('tr')}es cuatro</p>")

    def test_fade_wraps_rest(self):
        self.assertEqual(
            run("<p>Hola, mundo</p>", style="fade"),
            f'<p>{E("Ho")}<span class="fita-r">la, </span>{E("mu")}<span class="fita-r">ndo</span></p>',
        )

    def test_default_style(self):
        self.assertEqual(
            create_markup_emphasizer()("<p>lectura</p>"),
            f'<p>{E("lec")}<span class="fita-r">tura</span></p>',
        )

    def test_whitespace_only(self):
        self.assertEqual(
            run("<ul>\n  <li>a</li>\n</ul>"), f"<ul>\n  <li>{E('a')}</li>\n</ul>"
        )


class StaticCSS(unittest.TestCase):
    def test_css(self):
        self.assertIn("font-weight: bold", static_emphasis_css())
        self.assertIn(".fita-r { opacity", static_emphasis_css())
        self.assertNotIn("fita-r", static_emphasis_css("bold"))
        self.assertIn("color:", static_emphasis_css("color"))
        self.assertIn("underline", static_emphasis_css("underline"))
        self.assertIn(".fita-r", static_emphasis_css("fade"))
        for style in STYLES:
            self.assertNotIn("color-mix", static_emphasis_css(style))

    def test_matches_the_web_converter(self):
        # Same strings as staticEmphasisCSS in packages/core/src/markup.ts.
        self.assertEqual(
            static_emphasis_css("bold-fade"),
            ".fita-e { font-weight: bold; }\n.fita-r { opacity: 0.72; }",
        )
        self.assertEqual(static_emphasis_css("color"), ".fita-e { color: #1f5fa8; }")


if __name__ == "__main__":
    unittest.main()
