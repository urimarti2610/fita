"""Tests for the emphasis font. Run from the repository root:

    python -m unittest discover -s fonts/tests

The font is built into a temporary directory first, so the tests never depend on
a stale fonts/dist/.
"""

from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path

import uharfbuzz as hb
from fontTools.ttLib import TTFont

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import build  # noqa: E402

SUFFIX = build.SUFFIX


class EmphasisFontTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls._tmp = tempfile.TemporaryDirectory()
        cls.paths = build.build(Path(cls._tmp.name))
        cls.font = TTFont(cls.paths["ttf"])
        blob = hb.Blob.from_file_path(str(cls.paths["ttf"]))
        cls.hb_font = hb.Font(hb.Face(blob))

    @classmethod
    def tearDownClass(cls) -> None:
        cls._tmp.cleanup()

    def shape(self, text: str, features: dict | None = None, language: str | None = None):
        buf = hb.Buffer()
        buf.add_str(text)
        buf.guess_segment_properties()
        if language:
            buf.language = language
        hb.shape(self.hb_font, buf, features or {})
        names = [self.hb_font.glyph_to_string(info.codepoint) for info in buf.glyph_infos]
        return names, buf

    def emphasized(self, text: str, **kwargs) -> list[bool]:
        """One flag per glyph: whether it is a bold alternate."""
        names, _ = self.shape(text, **kwargs)
        return [name.endswith(SUFFIX) for name in names]

    def pattern(self, text: str, **kwargs) -> str:
        """Text with the emphasized glyphs in upper case markers: 'reading' -> 'REAding'."""
        names, buf = self.shape(text, **kwargs)
        flags = {}
        for name, info in zip(names, buf.glyph_infos, strict=True):
            flags[info.cluster] = flags.get(info.cluster, False) or name.endswith(SUFFIX)
        # uharfbuzz's add_str() numbers clusters by code point.
        return "".join(ch.upper() if flags.get(i) else ch for i, ch in enumerate(text))

    # --- The requested behaviour ------------------------------------------------

    def test_reading(self) -> None:
        names, _ = self.shape("reading")
        self.assertEqual(
            names, ["r.emph", "e.emph", "a.emph", "d", "i", "n", "g"], "7 letters -> 3 emphasized"
        )

    def test_sentence(self) -> None:
        self.assertEqual(
            self.pattern("a cat reads the morning paper"),
            "A Cat REads The MORning PAper",
        )

    def test_counts_match_core_algorithm(self) -> None:
        letters = "abcdefghijklmnopqrstuvwxyz" * 2
        for length in range(1, build.MAX_WORD + 6):
            with self.subTest(length=length):
                word = letters[:length]
                expected = build.emphasis_count(min(length, build.MAX_WORD))
                flags = self.emphasized(word)
                self.assertEqual(flags, [True] * expected + [False] * (length - expected))

    def test_emphasis_count_port(self) -> None:
        # Values from emphasisCount() in packages/core/src/emphasize.ts with defaults.
        expected = {1: 1, 2: 1, 3: 1, 4: 2, 5: 2, 6: 3, 7: 3, 8: 4, 9: 4, 10: 5, 11: 5,
                    12: 5, 13: 6, 15: 7, 20: 9, 30: 14}
        for length, count in expected.items():
            self.assertEqual(build.emphasis_count(length), count, length)

    def test_punctuation_and_spaces_are_boundaries(self) -> None:
        self.assertEqual(self.pattern("(hello), world!"), "(HEllo), WOrld!")
        self.assertEqual(self.pattern("well-known"), "WEll-KNown")

    def test_accents_precomposed_and_decomposed(self) -> None:
        self.assertEqual(self.pattern("àvia època"), "ÀVia ÈPoca")
        # x + COMBINING ACUTE (no precomposed glyph): 4 graphemes -> 2 emphasized,
        # and the mark stays attached to the bold base.
        names, buf = self.shape("x\u0301ylo")
        self.assertEqual(names, ["x.emph", "acutecomb", "y.emph", "l", "o"])
        mark = buf.glyph_positions[1]
        self.assertNotEqual((mark.x_offset, mark.y_offset), (0, 0), "accent placed on base")

    def test_catalan(self) -> None:
        self.assertEqual(self.pattern("l'àvia d'una", language="ca"), "l'ÀVia d'Una")
        self.assertEqual(self.pattern("l’àvia", language="ca"), "l’ÀVia")
        # col·lecció: 10 graphemes -> 5, the middle dot stays plain.
        flags = self.emphasized("col·lecció", language="ca")
        self.assertEqual(flags, [True, True, True, False, True] + [False] * 5)

    def test_contractions_are_one_word(self) -> None:
        self.assertEqual(self.pattern("don't it's"), "DOn't IT's")

    def test_words_with_digits_stay_plain(self) -> None:
        for text in ("abc123", "3rd", "mp3", "covid19", "1984"):
            with self.subTest(text=text):
                self.assertFalse(any(self.emphasized(text)))
        self.assertEqual(self.pattern("page 12 here"), "PAge 12 HEre")

    def test_other_languages(self) -> None:
        self.assertEqual(self.pattern("señal"), "SEñal")
        self.assertEqual(self.pattern("żółw"), "ŻÓłw")
        self.assertEqual(self.pattern("Straße"), "STRaße")

    def test_feature_off_means_plain_text(self) -> None:
        self.assertFalse(any(self.emphasized("reading is fun", features={"calt": False})))

    def test_scripts_without_glyphs_untouched(self) -> None:
        # Cyrillic, Greek words and CJK are not covered by the base font: no emphasis.
        for text in ("привет", "γεια", "読書"):
            with self.subTest(text=text):
                self.assertFalse(any(self.emphasized(text)))

    # --- Font integrity ---------------------------------------------------------

    def test_text_is_unchanged(self) -> None:
        source = TTFont(build.SRC_REGULAR)
        self.assertEqual(self.font.getBestCmap(), source.getBestCmap())

    def test_emphasis_glyphs_come_from_bold(self) -> None:
        bold = TTFont(build.SRC_BOLD)
        for name in ("r", "a", "eacute", "l"):
            with self.subTest(glyph=name):
                self.assertEqual(self.font["hmtx"][name + SUFFIX], bold["hmtx"][name])

    def test_renamed(self) -> None:
        family = build.brand_family()
        name = self.font["name"]
        self.assertEqual(name.getDebugName(1), family)
        self.assertEqual(name.getDebugName(6), family.replace(" ", "") + "-Regular")
        for name_id in (1, 3, 4, 6):
            self.assertNotIn("Atkinson", name.getDebugName(name_id))
        self.assertIn("Open Font License", name.getDebugName(13))

    def test_woff2(self) -> None:
        woff2 = TTFont(self.paths["woff2"])
        self.assertEqual(woff2.flavor, "woff2")
        self.assertEqual(woff2.getGlyphOrder(), self.font.getGlyphOrder())


if __name__ == "__main__":
    unittest.main()
