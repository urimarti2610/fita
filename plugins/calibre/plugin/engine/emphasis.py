"""Which part of each word to emphasize: a Python port of packages/core/src/emphasize.ts.

The TypeScript core relies on ``Intl.Segmenter`` (ICU). Python's standard library
has no Unicode segmentation, and calibre plugins cannot count on third-party
modules, so this module implements the parts of the Unicode rules the algorithm
needs, using only ``unicodedata``:

* words: the default word-boundary rules of UAX #29 (letters and digits join;
  apostrophes, middle dots and periods join letters; commas and periods join
  digits; combining marks and format characters attach to the word), with ICU's
  handling of Hangul syllables, Katakana and Han;
* graphemes: extended grapheme clusters of UAX #29 for what appears inside a
  word (combining marks, joiners, Hangul jamo, regional indicators, Indic
  conjuncts).

Known differences with ICU, all harmless for emphasis: scripts written without
spaces (Han, Kana, Thai, Lao, Khmer, Myanmar) are not split into dictionary
words, because they are left untouched anyway; Unicode properties come from the
Python runtime's ``unicodedata`` version.
"""

import math
import re
import unicodedata
from typing import Callable, List, NamedTuple, Optional

MIN_STRENGTH = 0.2
MAX_STRENGTH = 0.7


class EmphasisOptions(NamedTuple):
    #: Fraction of each word to emphasize, 0.2-0.7.
    strength: float = 0.45
    #: Words shorter than this (in graphemes) get exactly 1 emphasized grapheme.
    min_word_length: int = 4
    #: Emphasize 1 of every N processable words.
    every: int = 1
    #: Leave numbers and words containing digits untouched.
    skip_numbers: bool = True


DEFAULT_OPTIONS = EmphasisOptions()


class Span(NamedTuple):
    text: str
    emphasis: bool


def _number(value, fallback):
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        return fallback
    return value if math.isfinite(value) else fallback


def resolve_options(
    strength=None, min_word_length=None, every=None, skip_numbers=None
) -> EmphasisOptions:
    """Validates and fills in defaults. Out-of-range values are clamped, never rejected."""
    d = DEFAULT_OPTIONS
    return EmphasisOptions(
        strength=min(MAX_STRENGTH, max(MIN_STRENGTH, _number(strength, d.strength))),
        min_word_length=max(1, math.floor(_number(min_word_length, d.min_word_length))),
        every=max(1, math.floor(_number(every, d.every))),
        skip_numbers=d.skip_numbers if skip_numbers is None else bool(skip_numbers),
    )


def emphasis_count(length: int, options: EmphasisOptions) -> int:
    """How many leading graphemes of a word of ``length`` graphemes to emphasize."""
    if length <= 0:
        return 0
    if length < options.min_word_length:
        return 1
    # JavaScript's Math.round (half up), not Python's round (half to even).
    n = max(1, math.floor(length * options.strength + 0.5))
    return min(n, length - 1) if length >= 2 else n


# --- Protected text ---------------------------------------------------------

# JavaScript's \b is ASCII-only; reproduce it explicitly before ASCII patterns.
_B = r"(?<![A-Za-z0-9_])"
#: URLs, emails, file paths and code, detected before word segmentation.
#: Same alternatives, in the same order, as PROTECTED in emphasize.ts.
#: ``[^\W_]`` is "letter or digit" and ``[^\W\d]`` is "letter or underscore".
PROTECTED = re.compile(
    "|".join(
        [
            r"`[^`\n]+`",  # `inline code`
            _B + r"[a-z][a-z0-9+.\-]*://[^\s<>\"]+",  # scheme://...
            _B + r"www\.[^\s<>\"]+",  # www....
            r"[\w.%+\-]+@(?:[^\W_]|-)+(?:\.(?:[^\W_]|-)+)+",  # email
            r"(?<![^\W_])(?:~|\.{1,2})?/[\w.\-]+(?:/[\w.\-]*)+",  # /unix/path
            _B + r"[A-Za-z]:\\[^\s<>\"]+",  # C:\windows\path
            r"(?:[^\W\d]|\$)[\w$]*(?:\.(?:[^\W\d]|\$)[\w$]*)+\([^()\s]*\)",  # a.b(x)
            r"(?:[^\W\d]|\$)[\w$]*\(\)",  # call()
            r"[^\W_]*_\w+",  # snake_case
        ]
    ),
    re.IGNORECASE,
)

#: Code point ranges of the scripts written without spaces between words:
#: Han, Hiragana, Katakana, Thai, Lao, Khmer and Myanmar.
NO_SPACE_RANGES = (
    (0x0E00, 0x0E7F),  # Thai
    (0x0E80, 0x0EFF),  # Lao
    (0x1000, 0x109F),  # Myanmar
    (0x1780, 0x17FF),  # Khmer
    (0x19E0, 0x19FF),  # Khmer symbols
    (0x2E80, 0x2FDF),  # CJK radicals, Kangxi radicals
    (0x3005, 0x3007),  # iteration mark, ideographic zero
    (0x3021, 0x3029),  # Hangzhou numerals
    (0x3038, 0x303B),
    (0x3041, 0x309F),  # Hiragana
    (0x30A1, 0x30FA),  # Katakana
    (0x30FD, 0x30FF),
    (0x31F0, 0x31FF),  # Katakana phonetic extensions
    (0x32D0, 0x32FE),  # circled Katakana
    (0x3300, 0x3357),  # squared Katakana
    (0x3400, 0x4DBF),  # CJK extension A
    (0x4E00, 0x9FFF),  # CJK unified ideographs
    (0xA9E0, 0xA9FF),  # Myanmar extended B
    (0xAA60, 0xAA7F),  # Myanmar extended A
    (0xF900, 0xFAFF),  # CJK compatibility ideographs
    (0xFF66, 0xFF6F),  # halfwidth Katakana
    (0xFF71, 0xFF9D),
    (0x1B000, 0x1B16F),  # Kana supplement, extended
    (0x20000, 0x323AF),  # CJK extensions B-H
)


def is_no_space(cp: int) -> bool:
    for lo, hi in NO_SPACE_RANGES:
        if cp < lo:
            return False
        if cp <= hi:
            return True
    return False


# --- Word segmentation (UAX #29, default rules) -----------------------------

_OTHER, _LETTER, _HEBREW, _NUMERIC, _KATAKANA, _HANGUL, _EXTEND = range(7)
_MID_LETTER, _MID_NUM_LET, _MID_NUM, _SINGLE_QUOTE, _DOUBLE_QUOTE, _EXTEND_NUM_LET = range(7, 13)

_MID_LETTER_CHARS = ":\ufe55\uff1a\u00b7\u0387\u055f\u05f4\u2027\ufe13"
_MID_NUM_LET_CHARS = ".\u2018\u2019\u2024\ufe52\uff07\uff0e"
_MID_NUM_CHARS = ",;\u037e\u0589\u060c\u060d\u066c\u07f8\u2044\ufe10\ufe14\ufe50\ufe54\uff0c\uff1b"
_WORD_START = (_LETTER, _HEBREW, _NUMERIC, _KATAKANA, _HANGUL)
_LETTERS = (_LETTER, _HEBREW)
_ALNUM = (_LETTER, _HEBREW, _NUMERIC)
#: Which classes may follow which inside a word (WB5, WB8-WB10, WB13, WB13a-b).
#: As in ICU, Hangul only joins Hangul, and Han and Hiragana never join (each
#: character is its own segment here; ICU uses a dictionary, but they are left
#: untouched anyway). Thai, Lao, Khmer and Myanmar join like letters.
_JOINS = {
    _LETTER: _ALNUM + (_EXTEND_NUM_LET,),
    _HEBREW: _ALNUM + (_EXTEND_NUM_LET,),
    _NUMERIC: _ALNUM + (_EXTEND_NUM_LET,),
    _KATAKANA: (_KATAKANA, _EXTEND_NUM_LET),
    _HANGUL: (_HANGUL,),
    _EXTEND_NUM_LET: _ALNUM + (_KATAKANA, _EXTEND_NUM_LET),
}
#: Katakana and Hangul code points (the rest of NO_SPACE_RANGES is Han, Hiragana or SA scripts).
_KATAKANA_RANGES = (
    (0x30A1, 0x30FA), (0x30FC, 0x30FF), (0x31F0, 0x31FF), (0x32D0, 0x32FE),
    (0x3300, 0x3357), (0xFF66, 0xFF9D), (0x1B000, 0x1B000),
)
#: Hangul syllables (jamo are ordinary letters, as in ICU).
_HANGUL_RANGES = ((0xAC00, 0xD7A3),)
#: Thai, Lao, Myanmar and Khmer: ICU joins them with letters (then splits by dictionary).
_SA_RANGES = ((0x0E00, 0x0EFF), (0x1000, 0x109F), (0x1780, 0x17FF), (0x19E0, 0x19FF),
              (0xA9E0, 0xA9FF), (0xAA60, 0xAA7F))


def _in(cp, ranges):
    return any(lo <= cp <= hi for lo, hi in ranges)

#: Punctuation and modifier symbols that UAX #29 counts as letters (ALetter).
_EXTRA_LETTERS = frozenset(
    "\u02c2\u02c3\u02c4\u02c5\u02d2\u02d3\u02d4\u02d5\u02d6\u02d7\u02de\u02df"
    "\u02e5\u02e6\u02e7\u02e8\u02e9\u02ea\u02eb\u02ed\u02ef\u02f0\u02f1\u02f2"
    "\u02f3\u02f4\u02f5\u02f6\u02f7\u02f8\u02f9\u02fa\u02fb\u02fc\u02fd\u02fe\u02ff"
    "\u055a\u055b\u055c\u055e\u058a\u05f3"
)
_classes = {}


def _word_class(ch: str) -> int:
    cls = _classes.get(ch)
    if cls is not None:
        return cls
    cp = ord(ch)
    cat = unicodedata.category(ch)
    if cat in ("Mn", "Mc", "Me", "Cf") or 0x1F3FB <= cp <= 0x1F3FF:
        # Marks stay with their base, even in no-space scripts (the word is then skipped).
        cls = _EXTEND
    elif _in(cp, _KATAKANA_RANGES):
        cls = _KATAKANA
    elif _in(cp, _HANGUL_RANGES) and cat[0] == "L":
        cls = _HANGUL
    elif is_no_space(cp) and not _in(cp, _SA_RANGES):
        cls = _OTHER  # Han, Hiragana
    elif cat[0] == "L" or cat == "Nl" or ch in _EXTRA_LETTERS:
        hebrew = 0x05D0 <= cp <= 0x05F2 or 0xFB1D <= cp <= 0xFB4F
        cls = _HEBREW if hebrew else _LETTER
    elif cat == "Nd":
        cls = _NUMERIC
    elif ch == "'":
        cls = _SINGLE_QUOTE
    elif ch == '"':
        cls = _DOUBLE_QUOTE
    elif ch in _MID_LETTER_CHARS:
        cls = _MID_LETTER
    elif ch in _MID_NUM_LET_CHARS:
        cls = _MID_NUM_LET
    elif ch in _MID_NUM_CHARS:
        cls = _MID_NUM
    elif cat == "Pc" or ch == "\u202f":  # connectors and the narrow no-break space
        cls = _EXTEND_NUM_LET
    else:
        cls = _OTHER
    _classes[ch] = cls
    return cls


def _skip_extend(text: str, i: int, n: int) -> int:
    while i < n and _word_class(text[i]) == _EXTEND:
        i += 1
    return i


def _word_end(text: str, start: int, n: int) -> int:
    """End of the word starting at ``start`` (a letter or a digit)."""
    last = _word_class(text[start])
    i = start + 1
    while True:
        i = _skip_extend(text, i, n)
        if i >= n:
            return i
        c = _word_class(text[i])
        if c in _JOINS.get(last, ()):
            last = c
            i += 1
            continue
        nxt = _skip_extend(text, i + 1, n)
        after = _word_class(text[nxt]) if nxt < n else _OTHER
        if last in _LETTERS and c in (_MID_LETTER, _MID_NUM_LET, _SINGLE_QUOTE):
            if after in _LETTERS:  # WB6, WB7
                i = nxt
                continue
        if last == _NUMERIC and c in (_MID_NUM, _MID_NUM_LET, _SINGLE_QUOTE):
            if after == _NUMERIC:  # WB11, WB12
                i = nxt
                continue
        if last == _HEBREW and c == _DOUBLE_QUOTE and after == _HEBREW:  # WB7b, WB7c
            i = nxt
            continue
        if last == _HEBREW and c == _SINGLE_QUOTE:  # WB7a
            return nxt
        return i


#: Fast paths: candidates for a word start (letters and digits, refined by
#: _word_class), and runs of precomposed Latin, Greek and Cyrillic letters.
_CANDIDATE = re.compile("[^\\W_]|[" + "".join(sorted(_EXTRA_LETTERS)) + "]")
_SIMPLE_LETTERS = re.compile("[A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u024f\u0386-\u03ff\u0400-\u0481]+")


def segment_words(text: str):
    """Yields ``(segment, is_word)`` pairs that concatenate to ``text``."""
    n = len(text)
    i = 0
    other = 0
    while i < n:
        candidate = _CANDIDATE.search(text, i)
        if not candidate:
            break
        i = candidate.start()
        start_class = _word_class(text[i])
        if start_class not in _WORD_START:
            i += 1
            continue
        # WB13b: connectors and narrow no-break spaces join the word that follows.
        j = i
        while j > other and start_class in _JOINS[_EXTEND_NUM_LET]:
            k = j - 1
            while k > other and _word_class(text[k]) == _EXTEND:
                k -= 1
            if _word_class(text[k]) != _EXTEND_NUM_LET:
                break
            j = k
        if other < j:
            yield text[other:j], False
        simple = _SIMPLE_LETTERS.match(text, i)
        end = _word_end(text, simple.end() - 1 if simple else i, n)
        yield text[j:end], True
        i = other = end
    if other < n:
        yield text[other:], False


# --- Grapheme clusters ------------------------------------------------------

#: Latin, Greek and Cyrillic without combining marks: one code point per grapheme.
_SIMPLE_GRAPHEMES = re.compile("^[\u0020-\u02ff\u0370-\u03ff\u0400-\u0482\u048a-\u04ff]*$")


def _hangul(cp: int) -> str:
    if 0x1100 <= cp <= 0x115F or 0xA960 <= cp <= 0xA97C:
        return "L"
    if 0x1160 <= cp <= 0x11A7 or 0xD7B0 <= cp <= 0xD7C6:
        return "V"
    if 0x11A8 <= cp <= 0x11FF or 0xD7CB <= cp <= 0xD7FB:
        return "T"
    if 0xAC00 <= cp <= 0xD7A3:
        return "LV" if (cp - 0xAC00) % 28 == 0 else "LVT"
    return ""


def _grapheme_extends(prev: str, ch: str) -> bool:
    """True when there is no grapheme boundary between ``prev`` and ``ch``."""
    cp = ord(ch)
    if prev == "\r" and ch == "\n":
        return True
    if cp in (0x200C, 0x200D) or 0x1F3FB <= cp <= 0x1F3FF:
        return True
    if unicodedata.category(ch) in ("Mn", "Mc", "Me"):
        return prev not in "\r\n"
    if prev == "\u200d":  # emoji ZWJ sequences
        return unicodedata.category(ch) == "So"
    pc = ord(prev)
    if 0x1F1E6 <= pc <= 0x1F1FF and 0x1F1E6 <= cp <= 0x1F1FF:
        return True  # regional indicators (callers re-check pairs)
    a, b = _hangul(pc), _hangul(cp)
    return bool(
        (a == "L" and b in ("L", "V", "LV", "LVT"))
        or (a in ("LV", "V") and b in ("V", "T"))
        or (a in ("LVT", "T") and b == "T")
    )


#: Indic conjuncts (Unicode 15.1, GB9c): Indic_Conjunct_Break consonants and linkers.
_INCB_LINKERS = frozenset((0x094D, 0x09CD, 0x0ACD, 0x0B4D, 0x0C4D, 0x0D4D))
_INCB_CONSONANTS = (
    (0x0915, 0x0939), (0x0958, 0x095F), (0x0978, 0x097F),  # Devanagari
    (0x0995, 0x09A8), (0x09AA, 0x09B0), (0x09B2, 0x09B2), (0x09B6, 0x09B9),  # Bengali
    (0x09DC, 0x09DD), (0x09DF, 0x09DF), (0x09F0, 0x09F1),
    (0x0A95, 0x0AA8), (0x0AAA, 0x0AB0), (0x0AB2, 0x0AB3), (0x0AB5, 0x0AB9),  # Gujarati
    (0x0AF9, 0x0AF9),
    (0x0B15, 0x0B28), (0x0B2A, 0x0B30), (0x0B32, 0x0B33), (0x0B35, 0x0B39),  # Oriya
    (0x0B5C, 0x0B5D), (0x0B5F, 0x0B5F), (0x0B71, 0x0B71),
    (0x0C15, 0x0C28), (0x0C2A, 0x0C39), (0x0C58, 0x0C5A),  # Telugu
    (0x0D15, 0x0D3A),  # Malayalam
)


def grapheme_starts(text: str) -> List[int]:
    """Indices where each extended grapheme cluster of ``text`` starts."""
    starts = []
    regional = 0
    conjunct = 0  # GB9c: 0 none, 1 after a consonant, 2 after consonant + linker
    for i, ch in enumerate(text):
        cp = ord(ch)
        is_regional = 0x1F1E6 <= cp <= 0x1F1FF
        joined = i > 0 and _grapheme_extends(text[i - 1], ch)
        if is_regional and joined:
            joined = regional % 2 == 1  # pair regional indicators two by two
        consonant = _in(cp, _INCB_CONSONANTS)
        if consonant and conjunct == 2:
            joined = True  # Indic conjunct: consonant + virama + consonant
        if not joined:
            starts.append(i)
        regional = regional + 1 if is_regional else 0
        if consonant:
            conjunct = 1
        elif conjunct and cp in _INCB_LINKERS:
            conjunct = 2
        elif conjunct and not (_grapheme_extends("a", ch) or cp == 0x200D):
            conjunct = 0
    return starts


def grapheme_count(word: str) -> int:
    if _SIMPLE_GRAPHEMES.match(word):
        return len(word)
    return len(grapheme_starts(word))


def grapheme_prefix_length(word: str, count: int) -> int:
    """Number of code points covered by the first ``count`` graphemes of ``word``."""
    if _SIMPLE_GRAPHEMES.match(word):
        return count
    starts = grapheme_starts(word)
    return starts[count] if count < len(starts) else len(word)


# --- Emphasis ---------------------------------------------------------------

#: Elided articles and prepositions such as Catalan/French l', d', qu'.
_ELISION = re.compile(r"^([^\W\d_]{1,2})['\u2019]")


_NO_SPACE_CLASS = "".join(f"\\U{lo:08x}-\\U{hi:08x}" for lo, hi in NO_SPACE_RANGES)
#: Words left untouched: written in a no-space script, or (optionally) with digits.
_UNTOUCHED = re.compile(f"[{_NO_SPACE_CLASS}]")
_UNTOUCHED_OR_DIGIT = re.compile(f"[\\d{_NO_SPACE_CLASS}]")
#: Every protected pattern needs one of these; most paragraphs have none.
_MAYBE_PROTECTED = re.compile(r"[`:/@\\(_]|www\.", re.IGNORECASE)


class _SpanList:
    """Collects spans, merging neighbours with the same emphasis (joined lazily)."""

    def __init__(self):
        self.parts = []  # [pieces, emphasis]

    def push(self, text: str, emphasis: bool):
        if not text:
            return
        if self.parts and self.parts[-1][1] == emphasis:
            self.parts[-1][0].append(text)
        else:
            self.parts.append([[text], emphasis])

    def spans(self) -> List[Span]:
        return [Span("".join(pieces), emphasis) for pieces, emphasis in self.parts]


def create_emphasizer(options: Optional[EmphasisOptions] = None) -> Callable[[str], List[Span]]:
    """Returns a stateful emphasizer: the ``every`` counter carries over between
    calls, so a document processed in pieces behaves like one text."""
    opts = options or DEFAULT_OPTIONS
    processable = 0
    untouched = _UNTOUCHED_OR_DIGIT if opts.skip_numbers else _UNTOUCHED

    def emphasize_word(word: str, out: _SpanList):
        nonlocal processable
        if untouched.search(word):
            out.push(word, False)
            return
        index = processable
        processable += 1
        if index % opts.every != 0:
            out.push(word, False)
            return
        # Skip a short elided prefix (l'àvia, d'una) so the anchor falls on the main word.
        lead = ""
        elision = _ELISION.match(word)
        if elision and grapheme_count(word[elision.end() :]) >= 3:
            lead = elision.group(0)
        body = word[len(lead) :]
        count = emphasis_count(grapheme_count(body), opts)
        cut = grapheme_prefix_length(body, count)
        out.push(lead, False)
        out.push(body[:cut], True)
        out.push(body[cut:], False)

    def emphasize_plain(text: str, out: _SpanList):
        for segment, is_word in segment_words(text):
            if is_word:
                emphasize_word(segment, out)
            else:
                out.push(segment, False)

    def emphasize_chunk(text: str) -> List[Span]:
        out = _SpanList()
        last = 0
        matches = PROTECTED.finditer(text) if _MAYBE_PROTECTED.search(text) else ()
        for match in matches:
            emphasize_plain(text[last : match.start()], out)
            out.push(match.group(0), False)
            last = match.end()
        emphasize_plain(text[last:], out)
        return out.spans()

    return emphasize_chunk


def emphasize(text: str, options: Optional[EmphasisOptions] = None) -> List[Span]:
    """Splits ``text`` into emphasized and plain spans that concatenate to ``text``."""
    return create_emphasizer(options)(text)


_HTML_ESCAPES = {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}
_TAG_NAME = re.compile(r"^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$", re.IGNORECASE)


def escape_html(text: str) -> str:
    return re.sub(r"[&<>\"']", lambda m: _HTML_ESCAPES[m.group(0)], text)


def to_html(text: str, options: Optional[EmphasisOptions] = None, tag: str = "b") -> str:
    """HTML with the emphasized parts wrapped in ``<tag>``. All text is escaped."""
    if not _TAG_NAME.match(tag):
        raise ValueError(f"Invalid tag name: {tag}")
    out = []
    for span in emphasize(text, options):
        escaped = escape_html(span.text)
        out.append(f"<{tag}>{escaped}</{tag}>" if span.emphasis else escaped)
    return "".join(out)
