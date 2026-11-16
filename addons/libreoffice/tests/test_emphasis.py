"""Tests for the Python port of the emphasis algorithm."""

import json
import os
import sys
import time
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "extension", "pythonpath"))

from wordanchor.emphasis import (  # noqa: E402
    Emphasizer,
    Options,
    clip,
    emphasis_count,
    emphasize,
    emphasized_intervals,
    grapheme_count,
    graphemes,
    resolve_options,
    to_markup,
)

OPTION_NAMES = {
    "strength": "strength",
    "minWordLength": "min_word_length",
    "every": "every",
    "skipNumbers": "skip_numbers",
}


def options_from(js_options):
    return resolve_options(**{OPTION_NAMES[k]: v for k, v in (js_options or {}).items()})


class ParityWithCore(unittest.TestCase):
    """cases.json holds the TypeScript core's output (checked by parity.test.ts)."""

    def test_same_output_as_core(self):
        with open(os.path.join(HERE, "cases.json"), encoding="utf-8") as f:
            cases = json.load(f)
        self.assertGreater(len(cases), 40)
        for case in cases:
            with self.subTest(text=case["text"]):
                self.assertEqual(
                    to_markup(case["text"], options_from(case.get("options"))), case["expected"]
                )


class Algorithm(unittest.TestCase):
    def test_round_trips_text(self):
        text = "Mixed: café 你好 שלום 👩‍👩‍👧 https://x.y/z l'àvia\r\n2024 — ok 🇪🇸"
        self.assertEqual("".join(s.text for s in emphasize(text)), text)
        self.assertEqual("".join(graphemes(text)), text)

    def test_graphemes(self):
        self.assertEqual(grapheme_count("és"), 2)
        self.assertEqual(grapheme_count("👩‍👩‍👧"), 1)
        self.assertEqual(grapheme_count("🇪🇸🇫🇷"), 2)
        self.assertEqual(grapheme_count("👍🏽"), 1)
        self.assertEqual(grapheme_count("\r\n"), 1)
        self.assertEqual(grapheme_count(""), 0)

    def test_emphasis_count(self):
        opts = Options()
        self.assertEqual(emphasis_count(0, opts), 0)
        self.assertEqual(emphasis_count(3, opts), 1)
        self.assertEqual(emphasis_count(10, opts), 5)  # JS rounding: 4.5 -> 5
        self.assertEqual(emphasis_count(1, Options(min_word_length=1)), 1)
        self.assertEqual(emphasis_count(2, Options(min_word_length=1, strength=0.7)), 1)

    def test_resolve_options(self):
        self.assertEqual(
            resolve_options(strength=5, min_word_length=0, every=0.5, skip_numbers=0),
            Options(strength=0.7, min_word_length=1, every=1, skip_numbers=False),
        )
        self.assertEqual(
            resolve_options(strength=float("nan"), min_word_length="x", every=True),
            Options(),
        )

    def test_every_counter_carries_over(self):
        emphasizer = Emphasizer(resolve_options(every=2))
        first = emphasizer("uno dos")
        second = emphasizer("tres cuatro")
        self.assertEqual([s.emphasis for s in first], [True, False])
        self.assertEqual([s.emphasis for s in second], [True, False])

    def test_intervals(self):
        spans = emphasize("Hello world")
        self.assertEqual(emphasized_intervals(spans), [(0, 2), (6, 8)])
        self.assertEqual(clip([(0, 2), (6, 8)], 1, 7), [(1, 2), (6, 7)])
        self.assertEqual(clip([(0, 2)], 3, 9), [])

    def test_large_text(self):
        text = "Lorem ipsum dolor sit amet, l'àvia d'una col·lecció 2024. " * 20_000  # ~1.2 MB
        start = time.monotonic()
        spans = emphasize(text)
        self.assertEqual(sum(len(s.text) for s in spans), len(text))
        self.assertLess(time.monotonic() - start, 60)


if __name__ == "__main__":
    unittest.main()
