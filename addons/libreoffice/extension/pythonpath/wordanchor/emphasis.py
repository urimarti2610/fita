"""Python port of the word-emphasis algorithm in packages/core/src/emphasize.ts.

LibreOffice ships its own Python without ICU bindings, so word and grapheme
segmentation are approximated here with the standard library (``unicodedata``):

* words: runs of letters, marks, digits and connector punctuation, joined across
  apostrophes, middle dots and full stops between letters (UAX #29 MidLetter, so
  Catalan "l·l" and "l'àvia" stay whole) and across "." / "," between digits;
* graphemes: a base character plus combining marks, emoji modifiers, tags and
  ZWJ sequences; regional-indicator pairs (flags); CR LF.

Offsets are in code points (Python ``str`` indices), which is also how Writer's
text cursors move (``goRight`` steps over whole code points).

Keep the behaviour in sync with the TypeScript core; ``tests/test_emphasis.py``
mirrors its test cases.
"""

from __future__ import annotations

import math
import re
import unicodedata
from dataclasses import dataclass
from typing import Callable, Iterator, List, Optional, Tuple

MIN_STRENGTH = 0.2
MAX_STRENGTH = 0.7


@dataclass(frozen=True)
class Options:
    """Same meaning and defaults as ``EmphasisOptions`` in the core."""

    strength: float = 0.45
    min_word_length: int = 4
    every: int = 1
    skip_numbers: bool = True


@dataclass
class Span:
    text: str
    emphasis: bool


def resolve_options(strength=None, min_word_length=None, every=None, skip_numbers=None) -> Options:
    """Validates and fills in defaults. Out-of-range values are clamped, never rejected."""

    def pick(value, fallback):
        if isinstance(value, bool) or not isinstance(value, (int, float)):
            return fallback
        return value if math.isfinite(value) else fallback

    defaults = Options()
    return Options(
        strength=min(MAX_STRENGTH, max(MIN_STRENGTH, pick(strength, defaults.strength))),
        min_word_length=max(1, math.floor(pick(min_word_length, defaults.min_word_length))),
        every=max(1, math.floor(pick(every, defaults.every))),
        skip_numbers=defaults.skip_numbers if skip_numbers is None else bool(skip_numbers),
    )


# Text that must never be emphasized: URLs, emails, file paths and code. Python's
# ``re`` has no \p{L}: [^\W\d_] is "letter", [^\W_] is "letter or digit".
_PROTECTED = re.compile(
    "|".join(
        [
            r"`[^`\n]+`",  # `inline code`
            r"\b[a-zA-Z][a-zA-Z0-9+.\-]*://[^\s<>\"]+",  # scheme://…
            r"\b[wW][wW][wW]\.[^\s<>\"]+",  # www.…
            r"[\w.%+\-]+@(?:[^\W_]|-)+(?:\.(?:[^\W_]|-)+)+",  # email
            r"(?<![^\W_])(?:~|\.{1,2})?/[\w.\-]+(?:/[\w.\-]*)+",  # /unix/path
            r"\b[A-Za-z]:\\[^\s<>\"]+",  # C:\windows\path
            r"(?:[^\W\d]|\$)[\w$]*(?:\.(?:[^\W\d]|\$)[\w$]*)+\([^()\s]*\)",  # a.b(x)
            r"(?:[^\W\d]|\$)[\w$]*\(\)",  # call()
            r"[^\W_]*_\w+",  # snake_case
        ]
    )
)

# Scripts written without spaces between words: emphasis would land at arbitrary points.
_NO_SPACE_RANGES = (
    (0x0E00, 0x0EFF),  # Thai, Lao
    (0x1000, 0x109F),  # Myanmar
    (0x1780, 0x17FF),  # Khmer
    (0x19E0, 0x19FF),  # Khmer symbols
    (0x2E80, 0x2FDF),  # CJK radicals, Kangxi
    (0x3005, 0x3007),  # 々 〆 〇
    (0x3021, 0x3029),  # Hangzhou numerals
    (0x3038, 0x303B),
    (0x3040, 0x30FF),  # Hiragana, Katakana
    (0x31F0, 0x31FF),  # Katakana extensions
    (0x3400, 0x4DBF),  # CJK extension A
    (0x4E00, 0x9FFF),  # CJK unified ideographs
    (0xA9E0, 0xA9FF),  # Myanmar extended-B
    (0xAA60, 0xAA7F),  # Myanmar extended-A
    (0xF900, 0xFAFF),  # CJK compatibility
    (0xFF66, 0xFF9F),  # half-width Katakana
    (0x1AFF0, 0x1B16F),  # Kana supplement and extensions
    (0x20000, 0x3134F),  # CJK extensions B–H
)

_MID_LETTER = "'\u2019\u00b7."
_MID_NUM = ".,"
# Emoji modifiers and tag characters extend the previous grapheme.
_EXTEND_RANGES = ((0x1F3FB, 0x1F3FF), (0xE0020, 0xE007F))
_ELISION = re.compile(r"^([^\W\d_]{1,2})['\u2019]")


def _char_class(ranges) -> "re.Pattern[str]":
    return re.compile("[" + "".join(f"{chr(lo)}-{chr(hi)}" for lo, hi in ranges) + "]")


_NO_SPACE = _char_class(_NO_SPACE_RANGES)
_EXTEND_EXTRA = _char_class(_EXTEND_RANGES)
_DIGIT = re.compile(r"\d")


def is_no_space_char(ch: str) -> bool:
    return _NO_SPACE.match(ch) is not None


def _is_letter(ch: str) -> bool:
    return unicodedata.category(ch)[0] == "L"


def _is_digit(ch: str) -> bool:
    return unicodedata.category(ch) == "Nd"


def _is_word_char(ch: str) -> bool:
    cat = unicodedata.category(ch)
    return cat[0] in "LMN" or cat == "Pc"


def _is_extend(ch: str) -> bool:
    return unicodedata.category(ch)[0] == "M" or _EXTEND_EXTRA.match(ch) is not None


def _is_regional_indicator(ch: str) -> bool:
    return 0x1F1E6 <= ord(ch) <= 0x1F1FF


def graphemes(text: str) -> Iterator[str]:
    """Splits text into user-perceived characters (approximation of UAX #29)."""
    i, n = 0, len(text)
    while i < n:
        start = i
        ch = text[i]
        i += 1
        if ch == "\r" and i < n and text[i] == "\n":
            i += 1
        elif _is_regional_indicator(ch) and i < n and _is_regional_indicator(text[i]):
            i += 1
        elif not (ch in "\r\n" or unicodedata.category(ch) == "Cc"):
            while i < n:
                if _is_extend(text[i]):
                    i += 1
                elif text[i] == "\u200d" and i + 1 < n:
                    i += 2
                else:
                    break
        yield text[start:i]


def grapheme_count(word: str) -> int:
    return sum(1 for _ in graphemes(word))


def grapheme_prefix_length(word: str, count: int) -> int:
    """Number of code points covered by the first ``count`` graphemes of ``word``."""
    length = 0
    for seen, g in enumerate(graphemes(word)):
        if seen == count:
            return length
        length += len(g)
    return len(word)


def segment_words(text: str) -> Iterator[Tuple[str, bool]]:
    """Yields ``(segment, is_word_like)``; concatenating the segments yields ``text``."""
    i, n = 0, len(text)
    while i < n:
        ch = text[i]
        if _is_word_char(ch) and not (_is_extend(ch) and i > 0 and _is_word_char(text[i - 1])):
            no_space = is_no_space_char(ch)
            start = i
            i += 1
            while i < n:
                c = text[i]
                if _is_word_char(c) and (is_no_space_char(c) == no_space or _is_extend(c)):
                    i += 1
                elif (
                    i + 1 < n
                    and not no_space
                    and (
                        (c in _MID_LETTER and _is_letter(text[i - 1]) and _is_letter(text[i + 1]))
                        or (c in _MID_NUM and _is_digit(text[i - 1]) and _is_digit(text[i + 1]))
                    )
                ):
                    i += 2
                else:
                    break
            segment = text[start:i]
            yield segment, any(_is_letter(c) or unicodedata.category(c)[0] == "N" for c in segment)
        else:
            g = next(graphemes(text[i : i + 16]))
            yield g, False
            i += len(g)


def emphasis_count(length: int, options: Options) -> int:
    """How many leading graphemes of a word of ``length`` graphemes to emphasize."""
    if length <= 0:
        return 0
    if length < options.min_word_length:
        return 1
    # JavaScript's Math.round: halves round up (Python's round() rounds to even).
    n = max(1, math.floor(length * options.strength + 0.5))
    return min(n, length - 1) if length >= 2 else n


def _push(out: List[Span], text: str, emphasis: bool) -> None:
    if not text:
        return
    if out and out[-1].emphasis == emphasis:
        out[-1].text += text
    else:
        out.append(Span(text, emphasis))


class Emphasizer:
    """Stateful emphasizer: the ``every`` counter carries over between calls, so a
    document processed in pieces (paragraphs) behaves like one text."""

    def __init__(self, options: Optional[Options] = None):
        self.options = options or Options()
        self._processable = 0

    def _word(self, word: str, out: List[Span]) -> None:
        opts = self.options
        if (opts.skip_numbers and _DIGIT.search(word)) or _NO_SPACE.search(word):
            _push(out, word, False)
            return
        index = self._processable
        self._processable += 1
        if index % opts.every != 0:
            _push(out, word, False)
            return
        # Skip a short elided prefix (l'àvia, d'una) so the anchor falls on the main word.
        lead = ""
        elision = _ELISION.match(word)
        if elision and grapheme_count(word[elision.end() :]) >= 3:
            lead = elision.group(0)
        body = word[len(lead) :]
        cut = grapheme_prefix_length(body, emphasis_count(grapheme_count(body), opts))
        _push(out, lead, False)
        _push(out, body[:cut], True)
        _push(out, body[cut:], False)

    def _plain(self, text: str, out: List[Span]) -> None:
        for segment, word_like in segment_words(text):
            if word_like:
                self._word(segment, out)
            else:
                _push(out, segment, False)

    def __call__(self, text: str) -> List[Span]:
        out: List[Span] = []
        last = 0
        for match in _PROTECTED.finditer(text):
            self._plain(text[last : match.start()], out)
            _push(out, match.group(0), False)
            last = match.end()
        self._plain(text[last:], out)
        return out


def emphasize(text: str, options: Optional[Options] = None) -> List[Span]:
    """Splits ``text`` into emphasized and plain spans."""
    return Emphasizer(options)(text)


Interval = Tuple[int, int]


def emphasized_intervals(spans: List[Span]) -> List[Interval]:
    """Half-open ``[start, end)`` code-point offsets of the emphasized spans."""
    out: List[Interval] = []
    offset = 0
    for span in spans:
        end = offset + len(span.text)
        if span.emphasis:
            out.append((offset, end))
        offset = end
    return out


def clip(intervals: List[Interval], start: int, end: int) -> List[Interval]:
    """Keeps the parts of ``intervals`` that fall inside ``[start, end)``."""
    out: List[Interval] = []
    for s, e in intervals:
        s, e = max(s, start), min(e, end)
        if s < e:
            out.append((s, e))
    return out


def to_markup(text: str, options: Optional[Options] = None, mark: Callable[[str], str] = "[{}]".format) -> str:
    """Debug helper: the text with emphasized parts wrapped, e.g. ``[Rea]ding``."""
    return "".join(mark(s.text) if s.emphasis else s.text for s in emphasize(text, options))
