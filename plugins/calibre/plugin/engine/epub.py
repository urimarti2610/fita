"""EPUB conversion, mirroring apps/web/src/convert/epub.ts.

Every spine document is emphasized one at a time (only one chapter in memory),
the emphasis stylesheet is added to its <head>, and the book is repackaged with
``mimetype`` first and uncompressed. Metadata, images and fonts are copied as
they are. Converting is idempotent: any previous emphasis is removed first.
"""

import re
import zipfile
from typing import Callable, List, Optional

from .brand import EMPHASIS_CLASS, REST_CLASS
from .emphasis import EmphasisOptions
from .markup import DEFAULT_STYLE, create_markup_emphasizer, static_emphasis_css


class ConvertError(Exception):
    """A book we must not or cannot convert. ``code`` is "drm" or "invalid"."""

    def __init__(self, code: str):
        super().__init__(code)
        self.code = code


#: Font obfuscation is listed in encryption.xml too, but it is not DRM.
FONT_OBFUSCATION = frozenset(("http://www.idpf.org/2008/embedding", "http://ns.adobe.com/pdf/enc#RC"))
_ATTRIBUTE = re.compile(r"([\w:.-]+)\s*=\s*(?:\"([^\"]*)\"|'([^']*)')")
_CLASSES = f"(?:{re.escape(EMPHASIS_CLASS)}|{re.escape(REST_CLASS)})"
#: The stylesheet added by this plugin or by the web converter.
_OUR_STYLE = re.compile(
    r'<style type="text/css">(?:\s*\.' + _CLASSES + r" \{[^{}<]*\})+\s*</style>"
)
#: Emphasis wrappers: they only ever contain text.
_OUR_SPAN = re.compile(r'<span class="' + _CLASSES + r'">([^<]*)</span>')
_XML_ENCODING = re.compile(rb"^<\?xml[^>]*encoding\s*=\s*[\"']([\w.:-]+)")


def _attributes(tag: str) -> dict:
    return {m.group(1).lower(): m.group(2) or m.group(3) or "" for m in _ATTRIBUTE.finditer(tag)}


def _resolve(base: str, href: str) -> str:
    """Resolves an href from the OPF against the OPF's folder, as a zip path."""
    from urllib.parse import unquote

    out: List[str] = []
    for part in (base + unquote(href.split("#")[0])).split("/"):
        if part == "..":
            if out:
                out.pop()
        elif part not in (".", ""):
            out.append(part)
    return "/".join(out)


def has_drm(book: zipfile.ZipFile) -> bool:
    """True when the book has real DRM (not just font obfuscation)."""
    names = set(book.namelist())
    if "META-INF/rights.xml" in names:
        return True
    if "META-INF/encryption.xml" not in names:
        return False
    xml = book.read("META-INF/encryption.xml").decode("utf-8", "replace")
    algorithms = re.findall(r"EncryptionMethod[^>]*Algorithm\s*=\s*[\"']([^\"']+)", xml)
    return any(a not in FONT_OBFUSCATION for a in algorithms)


def read_spine(book: zipfile.ZipFile) -> List[str]:
    """Zip paths of the (X)HTML documents in the spine, in reading order."""
    names = set(book.namelist())
    try:
        container = book.read("META-INF/container.xml").decode("utf-8", "replace")
    except KeyError as e:
        raise ConvertError("invalid") from e
    m = re.search(r"full-path\s*=\s*[\"']([^\"']+)", container)
    if not m or m.group(1) not in names:
        raise ConvertError("invalid")
    opf_path = m.group(1)
    opf = book.read(opf_path).decode("utf-8", "replace")
    base = opf_path[: opf_path.rfind("/") + 1]
    items = {}
    for tag in re.finditer(r"<(?:\w+:)?item\b[^>]*>", opf):
        a = _attributes(tag.group(0))
        if a.get("id") and a.get("href"):
            items[a["id"]] = (_resolve(base, a["href"]), a.get("media-type", ""))
    spine = []
    for tag in re.finditer(r"<(?:\w+:)?itemref\b[^>]*>", opf):
        item = items.get(_attributes(tag.group(0)).get("idref", ""))
        if item and re.search("x?html", item[1]) and item[0] in names and item[0] not in spine:
            spine.append(item[0])
    return spine


def add_style(markup: str, css: str) -> str:
    """Adds the emphasis stylesheet to a document's <head>."""
    m = re.search(r"</head\s*>", markup, re.IGNORECASE)
    if not m:
        return markup
    return f'{markup[: m.start()]}<style type="text/css">{css}</style>{markup[m.start() :]}'


def strip_emphasis(markup: str) -> str:
    """Removes the emphasis added by this plugin or the web converter."""
    return _OUR_SPAN.sub(r"\1", _OUR_STYLE.sub("", markup))


def _decode(data: bytes):
    if data.startswith(b"\xef\xbb\xbf"):
        return data[3:].decode("utf-8"), "utf-8-sig"
    m = _XML_ENCODING.match(data)
    encoding = m.group(1).decode("ascii") if m else "utf-8"
    return data.decode(encoding), encoding


def _rewrite(
    src: str,
    dst: str,
    transform: Callable[[str], str],
    progress: Optional[Callable[[float], None]],
    aborted: Optional[Callable[[], bool]],
) -> None:
    try:
        book = zipfile.ZipFile(src)
    except zipfile.BadZipFile as e:
        raise ConvertError("invalid") from e
    with book:
        if has_drm(book):
            raise ConvertError("drm")
        chapters = set(read_spine(book))
        done = 0
        with zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED) as out:
            out.writestr(
                zipfile.ZipInfo("mimetype", (1980, 1, 1, 0, 0, 0)),
                "application/epub+zip",
                compress_type=zipfile.ZIP_STORED,
            )
            for info in book.infolist():
                if info.filename == "mimetype":
                    continue
                if aborted and aborted():
                    raise InterruptedError
                data = book.read(info)
                if info.filename in chapters:
                    try:
                        markup, encoding = _decode(data)
                    except (LookupError, UnicodeDecodeError):
                        pass  # Undecodable chapter: copy it untouched.
                    else:
                        data = transform(markup).encode(encoding, "xmlcharrefreplace")
                        info = zipfile.ZipInfo(info.filename, info.date_time)
                        info.compress_type = zipfile.ZIP_DEFLATED
                    done += 1
                    if progress:
                        progress(done / len(chapters))
                out.writestr(info, data)


def convert_epub(
    src: str,
    dst: str,
    options: Optional[EmphasisOptions] = None,
    style: str = DEFAULT_STYLE,
    progress: Optional[Callable[[float], None]] = None,
    aborted: Optional[Callable[[], bool]] = None,
) -> None:
    """Writes to ``dst`` an emphasized copy of the EPUB at ``src``.

    Raises ConvertError for DRM-protected or broken books, InterruptedError when
    ``aborted()`` becomes true.
    """
    emphasize = create_markup_emphasizer(options, style)
    css = static_emphasis_css(style)
    _rewrite(src, dst, lambda m: add_style(emphasize(strip_emphasis(m)), css), progress, aborted)


def remove_emphasis(
    src: str,
    dst: str,
    progress: Optional[Callable[[float], None]] = None,
    aborted: Optional[Callable[[], bool]] = None,
) -> None:
    """Writes to ``dst`` a copy of the EPUB at ``src`` without emphasis."""
    _rewrite(src, dst, strip_emphasis, progress, aborted)

