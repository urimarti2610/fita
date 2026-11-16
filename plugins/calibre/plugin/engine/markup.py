"""Markup-level emphasis for (X)HTML strings: a Python port of packages/core/src/markup.ts.

Text between tags is emphasized; tags, attributes, comments and skipped elements
pass through byte for byte. The output uses the same classes and stylesheet as the
web converter, so books converted on fitaread.com and in calibre look the same.
"""

import re
import unicodedata
from typing import Callable, Optional

from .brand import EMPHASIS_CLASS, REST_CLASS
from .emphasis import EmphasisOptions, create_emphasizer

STYLES = ("bold-fade", "bold", "color", "underline", "fade")
DEFAULT_STYLE = "bold-fade"

#: Elements whose content is copied verbatim.
SKIP_TAGS = frozenset(
    "head script style noscript textarea select option code pre kbd samp svg math canvas "
    "iframe title template".split()
)
#: Elements whose content is raw text in HTML: it may contain "<" and is skipped wholesale.
RAW_TEXT_TAGS = frozenset("script style textarea title xmp noscript".split())
VOID_TAGS = frozenset("area base br col embed hr img input link meta source track wbr".split())

OPEN_TAG = re.compile(
    r"<([A-Za-z][^\s/>]*)((?:\s+[^\s=/>]+(?:\s*=\s*(?:\"[^\"]*\"|'[^']*'|[^\s\"'=<>`]+))?)*)\s*(/?)>"
)
CLOSE_TAG = re.compile(r"</([A-Za-z][^\s/>]*)\s*>")
SKIP_ATTRS = re.compile(
    r"\scontenteditable(?:\s*=\s*(?![\"']?false[\"']?)|\s|$)|\saria-hidden\s*=\s*[\"']?true",
    re.IGNORECASE,
)

#: Named entities beyond XML's five: the common ones in ebooks and web pages.
NAMED = {
    "amp": "&",
    "lt": "<",
    "gt": ">",
    "quot": '"',
    "apos": "'",
    "nbsp": " ",
    "shy": "­",
    "ndash": "–",
    "mdash": "—",
    "hellip": "…",
    "lsquo": "‘",
    "rsquo": "’",
    "ldquo": "“",
    "rdquo": "”",
    "laquo": "«",
    "raquo": "»",
    "middot": "·",
    "iexcl": "¡",
    "iquest": "¿",
    "copy": "©",
    "reg": "®",
    "deg": "°",
    "euro": "€",
    "thinsp": " ",
    "ensp": " ",
    "emsp": " ",
    "zwj": "‍",
    "zwnj": "‌",
    "szlig": "ß",
    "aelig": "æ",
    "AElig": "Æ",
    "oslash": "ø",
    "Oslash": "Ø",
    "yuml": "ÿ",
}
# Latin-1 letters: &aacute; &Ntilde; &ccedil; &ouml; ...
_MARKS = {
    "grave": "̀",
    "acute": "́",
    "circ": "̂",
    "tilde": "̃",
    "uml": "̈",
    "ring": "̊",
    "cedil": "̧",
}
for _base, _names in {
    "a": "grave acute circ tilde uml ring",
    "e": "grave acute circ uml",
    "i": "grave acute circ uml",
    "o": "grave acute circ tilde uml",
    "u": "grave acute circ uml",
    "y": "acute",
    "n": "tilde",
    "c": "cedil",
}.items():
    for _mark in _names.split():
        for _letter in (_base, _base.upper()):
            NAMED.setdefault(
                _letter + _mark, unicodedata.normalize("NFC", _letter + _MARKS[_mark])
            )

#: Stands in for an entity we cannot decode; not a letter, so it never joins a word.
OPAQUE = "￼"
ENTITY = re.compile(r"&(?:#(\d+)|#[xX]([0-9a-fA-F]+)|([A-Za-z][A-Za-z0-9]*));")
_LETTER = re.compile(r"[^\W\d_]")
_NOT_SPACE = re.compile(r"\S")
_SPECIALS = (("<!--", "-->"), ("<![CDATA[", "]]>"), ("<?", "?>"), ("<!", ">"))


def _decode(text: str, opaque: list) -> str:
    def replace(m):
        dec, hexa, name = m.groups()
        code = int(dec, 10) if dec else int(hexa, 16) if hexa else -1
        if 0 < code <= 0x10FFFF:
            return chr(code)
        named = NAMED.get(name) if name else None
        if named:
            return named
        opaque.append(m.group(0))
        return OPAQUE

    return ENTITY.sub(replace, text)


def _encode(text: str, opaque: list) -> str:
    escaped = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    if opaque and OPAQUE in escaped:
        return re.sub(OPAQUE, lambda _: opaque.pop(0), escaped)
    return escaped


def _local_name(qualified: str) -> str:
    return qualified[qualified.find(":") + 1 :].lower()


def _find_close(markup: str, name: str, start: int) -> int:
    """Index of the closing tag of a raw-text element, case-insensitive."""
    m = re.compile(r"</(?:[A-Za-z][\w.-]*:)?" + re.escape(name) + r"\s*>", re.IGNORECASE).search(
        markup, start
    )
    return m.start() if m else len(markup)


def create_markup_emphasizer(
    options: Optional[EmphasisOptions] = None, style: str = DEFAULT_STYLE
) -> Callable[[str], str]:
    """Returns a stateful markup emphasizer: the ``every`` counter carries across
    calls, so a book processed chapter by chapter behaves as one text."""
    emphasizer = create_emphasizer(options)
    rest_open = f'<span class="{REST_CLASS}">' if style in ("fade", "bold-fade") else ""
    rest_close = "</span>" if rest_open else ""
    emphasis_open = f'<span class="{EMPHASIS_CLASS}">'

    def text(raw: str) -> str:
        if not _NOT_SPACE.search(raw):
            return raw
        opaque = []
        decoded = _decode(raw, opaque)
        out = []
        for span in emphasizer(decoded):
            encoded = _encode(span.text, opaque)
            if span.emphasis:
                out.append(f"{emphasis_open}{encoded}</span>")
            elif _LETTER.search(span.text):
                out.append(f"{rest_open}{encoded}{rest_close}")
            else:
                out.append(encoded)
        return "".join(out)

    def emphasize_markup(markup: str) -> str:
        out = []
        skip = []
        i = 0
        n = len(markup)
        while i < n:
            lt = markup.find("<", i)
            end = n if lt == -1 else lt
            if end > i:
                chunk = markup[i:end]
                out.append(chunk if skip else text(chunk))
                i = end
                continue
            # At "<": comment, CDATA, processing instruction, doctype, or a tag.
            special = next((s for s in _SPECIALS if markup.startswith(s[0], i)), None)
            if special:
                close = markup.find(special[1], i)
                stop = n if close == -1 else close + len(special[1])
                out.append(markup[i:stop])
                i = stop
                continue
            closing = CLOSE_TAG.match(markup, i)
            if closing:
                name = _local_name(closing.group(1))
                if skip and skip[-1] == name:
                    skip.pop()
                out.append(closing.group(0))
                i = closing.end()
                continue
            opening = OPEN_TAG.match(markup, i)
            if not opening:
                # A stray "<" in HTML text.
                out.append("<" if skip else "&lt;")
                i += 1
                continue
            out.append(opening.group(0))
            i = opening.end()
            name = _local_name(opening.group(1))
            if opening.group(3) == "/" or name in VOID_TAGS:
                continue
            if name in RAW_TEXT_TAGS:
                close = _find_close(markup, name, i)
                out.append(markup[i:close])
                i = close
                continue
            if skip:
                skipped = skip[-1] == name
            else:
                skipped = name in SKIP_TAGS or bool(SKIP_ATTRS.search(opening.group(2) or ""))
            if skipped:
                skip.append(name)
        return "".join(out)

    return emphasize_markup


def static_emphasis_css(style: str = DEFAULT_STYLE) -> str:
    """Stylesheet for static documents (ebooks). Uses only CSS that e-readers support."""
    e = f".{EMPHASIS_CLASS}"
    r = f".{REST_CLASS}"
    if style == "bold":
        return f"{e} {{ font-weight: bold; }}"
    if style == "color":
        return f"{e} {{ color: #1f5fa8; }}"
    if style == "underline":
        return f"{e} {{ text-decoration: underline; }}"
    if style == "fade":
        return f"{r} {{ opacity: 0.72; }}"
    return f"{e} {{ font-weight: bold; }}\n{r} {{ opacity: 0.72; }}"
