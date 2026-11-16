"""EPUB conversion: structure, idempotence, removal and DRM detection."""

import os
import sys
import tempfile
import unittest
import zipfile

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "plugin"))

from engine.emphasis import resolve_options  # noqa: E402
from engine.epub import ConvertError, convert_epub, remove_emphasis  # noqa: E402

CHAPTER = """<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="ca" xml:lang="ca">
<head><title>Capítol</title></head>
<body><p>L'àvia llegia &amp; somreia.</p><pre>codi intacte</pre></body>
</html>
"""
OPF = """<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:identifier id="uid">urn:uuid:1</dc:identifier><dc:title>Llibre</dc:title>
<dc:language>ca</dc:language></metadata>
<manifest>
<item id="c1" href="Text/chapter%201.xhtml" media-type="application/xhtml+xml"/>
<item id="img" href="Images/a.png" media-type="image/png"/>
</manifest>
<spine><itemref idref="c1"/></spine>
</package>
"""
CONTAINER = """<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
<rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>
"""
PNG = b"\x89PNG\r\n\x1a\n" + bytes(range(256))


def make_epub(path, extra=None):
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("mimetype", "application/epub+zip", compress_type=zipfile.ZIP_STORED)
        z.writestr("META-INF/container.xml", CONTAINER)
        z.writestr("OEBPS/content.opf", OPF)
        z.writestr("OEBPS/Text/chapter 1.xhtml", CHAPTER)
        z.writestr("OEBPS/Images/a.png", PNG, compress_type=zipfile.ZIP_STORED)
        for name, data in (extra or {}).items():
            z.writestr(name, data)


class ConvertEpub(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.src = os.path.join(self.tmp.name, "book.epub")
        self.dst = os.path.join(self.tmp.name, "out.epub")
        make_epub(self.src)

    def tearDown(self):
        self.tmp.cleanup()

    def chapter(self, path):
        with zipfile.ZipFile(path) as z:
            return z.read("OEBPS/Text/chapter 1.xhtml").decode("utf-8")

    def test_structure_and_emphasis(self):
        fractions = []
        convert_epub(self.src, self.dst, resolve_options(), "bold", fractions.append)
        with zipfile.ZipFile(self.dst) as z:
            first = z.infolist()[0]
            self.assertEqual(first.filename, "mimetype")
            self.assertEqual(first.compress_type, zipfile.ZIP_STORED)
            self.assertEqual(z.read("mimetype"), b"application/epub+zip")
            self.assertEqual(z.read("OEBPS/Images/a.png"), PNG)
            self.assertEqual(z.read("OEBPS/content.opf").decode(), OPF)
            self.assertIsNone(z.testzip())
        chapter = self.chapter(self.dst)
        self.assertIn('<style type="text/css">.fita-e { font-weight: bold; }</style></head>', chapter)
        self.assertIn('L\'<span class="fita-e">àv</span>ia', chapter)
        self.assertIn("<pre>codi intacte</pre>", chapter)
        self.assertIn("<title>Capítol</title>", chapter)
        self.assertEqual(fractions, [1.0])

    def test_idempotent_and_removable(self):
        convert_epub(self.src, self.dst, resolve_options(), "bold-fade")
        again = os.path.join(self.tmp.name, "again.epub")
        convert_epub(self.dst, again, resolve_options(strength=0.7), "underline")
        chapter = self.chapter(again)
        self.assertEqual(chapter.count("<style"), 1)
        self.assertNotIn("fita-r", chapter)
        self.assertIn("text-decoration: underline", chapter)
        plain = os.path.join(self.tmp.name, "plain.epub")
        remove_emphasis(again, plain)
        self.assertEqual(self.chapter(plain), CHAPTER.replace("&amp;", "&amp;"))

    def test_drm(self):
        locked = os.path.join(self.tmp.name, "locked.epub")
        make_epub(
            locked,
            {
                "META-INF/encryption.xml": '<encryption><EncryptedData><EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#aes128-cbc"/></EncryptedData></encryption>'
            },
        )
        with self.assertRaises(ConvertError) as ctx:
            convert_epub(locked, self.dst)
        self.assertEqual(ctx.exception.code, "drm")

    def test_font_obfuscation_is_not_drm(self):
        fonts = os.path.join(self.tmp.name, "fonts.epub")
        make_epub(
            fonts,
            {
                "META-INF/encryption.xml": '<encryption><EncryptedData><EncryptionMethod Algorithm="http://www.idpf.org/2008/embedding"/></EncryptedData></encryption>'
            },
        )
        convert_epub(fonts, self.dst)
        self.assertIn("fita-e", self.chapter(self.dst))

    def test_invalid(self):
        broken = os.path.join(self.tmp.name, "broken.epub")
        with zipfile.ZipFile(broken, "w") as z:
            z.writestr("mimetype", "application/epub+zip")
        with self.assertRaises(ConvertError) as ctx:
            convert_epub(broken, self.dst)
        self.assertEqual(ctx.exception.code, "invalid")

    def test_abort(self):
        with self.assertRaises(InterruptedError):
            convert_epub(self.src, self.dst, aborted=lambda: True)


if __name__ == "__main__":
    unittest.main()
