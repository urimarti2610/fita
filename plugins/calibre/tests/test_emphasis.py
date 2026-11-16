"""Mirrors packages/core/test/emphasize.test.ts. Run: python3 -m unittest discover plugins/calibre/tests"""

import os
import sys
import time
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "plugin"))

from engine.emphasis import (  # noqa: E402
    Span,
    create_emphasizer,
    emphasis_count,
    emphasize,
    resolve_options,
    to_html,
)

#: Fixed parameters for segmentation tests, as CLASSIC in packages/core/test/helpers.ts.
CLASSIC = dict(strength=0.4, min_word_length=1)


def show(text, **options):
    spans = emphasize(text, resolve_options(**{**CLASSIC, **options}))
    return "".join(f"[{s.text}]" if s.emphasis else s.text for s in spans)


def join(text, **options):
    return "".join(s.text for s in emphasize(text, resolve_options(**{**CLASSIC, **options})))


class Languages(unittest.TestCase):
    def test_languages(self):
        cases = [
            ("es", "Hola, ¿qué tal estás?", "[Ho]la, ¿[q]ué [t]al [es]tás?"),
            ("es ñ", "El niño soñó", "[E]l [ni]ño [so]ñó"),
            ("ca l·l", "La col·legiala", "[L]a [col·]legiala"),
            ("ca elision", "l'àvia d'una casa", "l'[àv]ia d'[u]na [ca]sa"),
            ("ca typographic apostrophe", "L’home", "L’[ho]me"),
            ("en", "The quick brown fox", "[T]he [qu]ick [br]own [f]ox"),
            ("en contractions", "don't it's", "[do]n't [it]'s"),
            ("ru", "Съешь же ещё этих", "[Съ]ешь [ж]е [е]щё [эт]их"),
            ("pl", "Zażółć gęślą jaźń", "[Za]żółć [gę]ślą [ja]źń"),
            ("el", "Καλημέρα κόσμε", "[Καλ]ημέρα [κό]σμε"),
            ("ar", "مرحبا بالعالم", "[مر]حبا [بال]عالم"),
            ("he", "שלום עולם", "[של]ום [עו]לם"),
        ]
        for name, text, expected in cases:
            with self.subTest(name):
                self.assertEqual(show(text), expected)

    def test_chinese_and_japanese_untouched(self):
        self.assertEqual(show("你好世界"), "你好世界")
        self.assertEqual(show("こんにちは世界、カタカナ"), "こんにちは世界、カタカナ")
        self.assertTrue(all(not s.emphasis for s in emphasize("你好世界")))

    def test_thai_lao_khmer_myanmar_untouched(self):
        for text in ["ภาษาไทย", "ພາສາລາວ", "ភាសាខ្មែរ", "မြန်မာဘာသာ"]:
            self.assertEqual(show(text), text)

    def test_latin_mixed_with_cjk(self):
        self.assertEqual(show("你好 hello"), "你好 [he]llo")

    def test_rtl_logical_order(self):
        text = "שלום עולם"
        self.assertEqual(join(text), text)
        self.assertEqual(emphasize(text, resolve_options(**CLASSIC))[0], Span("של", True))

    def test_arabic_with_diacritics(self):
        # Harakat are combining marks: they stay with their letter.
        self.assertEqual(show("كَتَبَ"), "[كَ]تَبَ")


class Defaults(unittest.TestCase):
    def test_defaults(self):
        text = "Es casi insultantemente simple. Y quizá funciona precisamente por eso"
        self.assertEqual(
            "".join(f"[{s.text}]" if s.emphasis else s.text for s in emphasize(text)),
            "[E]s [ca]si [insulta]ntemente [sim]ple. [Y] [qu]izá [func]iona [preci]samente [p]or [e]so",
        )
        opts = resolve_options()
        self.assertEqual((opts.strength, opts.min_word_length, opts.every), (0.45, 4, 1))


class Graphemes(unittest.TestCase):
    def test_emoji_and_combining_sequences(self):
        self.assertEqual(show("I ❤️ 👩‍👩‍👧 café"), "[I] ❤️ 👩‍👩‍👧 [ca]fé")
        self.assertEqual(show("ñ̃e̊xamp"), "[ñ̃e̊]xamp")
        self.assertEqual(show("e\u0301s"), "[e\u0301]s")

    def test_ligatures(self):
        self.assertEqual(show("ﬁnd"), "[ﬁ]nd")

    def test_flags_and_hangul(self):
        self.assertEqual(join("🇪🇸🇫🇷 한국어"), "🇪🇸🇫🇷 한국어")
        self.assertEqual(show("한국어"), "[한]국어")
        # Decomposed Hangul jamo form one grapheme per syllable.
        self.assertEqual(show("\u1112\u1161\u11ab\u1100\u116e\u11a8"), "[\u1112\u1161\u11ab]\u1100\u116e\u11a8")


class Rules(unittest.TestCase):
    def test_at_least_one_and_one_plain(self):
        self.assertEqual(emphasis_count(1, resolve_options()), 1)
        self.assertEqual(emphasis_count(2, resolve_options(strength=0.7)), 1)
        self.assertEqual(emphasis_count(10, resolve_options(strength=0.7)), 7)
        self.assertEqual(emphasis_count(10, resolve_options(strength=0.2)), 2)
        self.assertEqual(emphasis_count(0, resolve_options()), 0)

    def test_rounds_half_up_like_javascript(self):
        self.assertEqual(emphasis_count(10, resolve_options(strength=0.45)), 5)
        self.assertEqual(emphasis_count(5, resolve_options(strength=0.5)), 3)

    def test_min_word_length(self):
        self.assertEqual(show("casa elefante", min_word_length=5, strength=0.7), "[c]asa [elefan]te")

    def test_every(self):
        self.assertEqual(show("uno dos 3 tres cuatro", every=2), "[u]no dos 3 [tr]es cuatro")

    def test_every_across_chunks(self):
        run = create_emphasizer(resolve_options(**CLASSIC, every=2))
        a = run("uno dos")
        b = run("tres cuatro")
        self.assertEqual([s.emphasis for s in a], [True, False])
        self.assertEqual(b[0], Span("tr", True))

    def test_clamps_options(self):
        self.assertEqual(resolve_options(strength=5).strength, 0.7)
        self.assertEqual(resolve_options(strength=-1).strength, 0.2)
        self.assertEqual(resolve_options(strength=float("nan")).strength, 0.45)
        self.assertEqual(resolve_options(strength="x").strength, 0.45)
        self.assertEqual(resolve_options(every=0).every, 1)
        self.assertEqual(resolve_options(min_word_length=2.7).min_word_length, 2)


class Numbers(unittest.TestCase):
    def test_skips_numbers(self):
        self.assertEqual(show("Año 2024, 3D y 1.000"), "[A]ño 2024, 3D [y] 1.000")
        self.assertEqual(show("٣٤٥ mil"), "٣٤٥ [m]il")

    def test_processes_numbers_when_asked(self):
        self.assertEqual(show("12345 3Dmax", skip_numbers=False), "[12]345 [3D]max")


class Protected(unittest.TestCase):
    def test_untouched(self):
        for text in [
            "https://example.com/path?q=1",
            "http://ejemplo.cat",
            "www.example.org/page",
            "persona@example.com",
            "nom.cognom@domini.cat",
            "/usr/local/bin",
            "./src/index.ts",
            "~/Documents/libro.epub",
            "C:\\Users\\docs",
            "`npm install`",
            "foo()",
            "console.log(x)",
            "snake_case_name",
        ]:
            with self.subTest(text):
                self.assertEqual(show(f"palabra {text} palabra"), f"[pal]abra {text} [pal]abra")

    def test_prose_with_slashes(self):
        self.assertEqual(show("and/or amigo(a)"), "[a]nd/[o]r [am]igo([a])")


class EdgeCases(unittest.TestCase):
    def test_empty(self):
        self.assertEqual(emphasize(""), [])
        self.assertEqual(emphasize("  \n\t"), [Span("  \n\t", False)])

    def test_merges_spans(self):
        self.assertEqual(emphasize("¡¡ ..."), [Span("¡¡ ...", False)])

    def test_round_trip(self):
        text = "Mixed: café 你好 שלום 👩‍👩‍👧 https://x.y/z l'àvia\r\n2024 — ok\u00ad"
        self.assertEqual(join(text), text)

    def test_soft_hyphen_inside_word(self):
        self.assertEqual(show("pa\u00adlabra"), "[pa\u00ad]labra")

    def test_large_text(self):
        paragraph = (
            "Lorem ipsum dolor sit amet, l'àvia col·leccionava llibres. "
            "Съешь же ещё этих мягких булок. "
        )
        size = int(os.environ.get("FITA_LARGE_TEXT_MB", "5")) * 1024 * 1024
        text = paragraph * (size // len(paragraph) + 1)
        start = time.perf_counter()
        spans = emphasize(text)
        elapsed = time.perf_counter() - start
        self.assertGreater(len(spans), 100_000)
        self.assertEqual(sum(len(s.text) for s in spans), len(text))
        self.assertLess(elapsed, 120)


class ToHTML(unittest.TestCase):
    def test_escapes(self):
        opts = resolve_options(**CLASSIC)
        self.assertEqual(
            to_html("<b>Tom & Jerry</b>", opts),
            "&lt;<b>b</b>&gt;<b>T</b>om &amp; <b>Je</b>rry&lt;/<b>b</b>&gt;",
        )
        self.assertEqual(
            to_html("\"quotes\" 'single'", opts), "&quot;<b>qu</b>otes&quot; &#39;<b>si</b>ngle&#39;"
        )

    def test_custom_tag(self):
        opts = resolve_options(**CLASSIC)
        self.assertEqual(to_html("hola", opts, "strong"), "<strong>ho</strong>la")
        with self.assertRaises(ValueError):
            to_html("hola", opts, "b onclick=x")


if __name__ == "__main__":
    unittest.main()
