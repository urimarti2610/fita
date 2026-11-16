"""Tests for the Writer glue, against an in-memory document model."""

import os
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, "..", "extension", "pythonpath"))

from fake_writer import Document, Paragraph, Selection, Table, Text  # noqa: E402
from wordanchor import settings, writer  # noqa: E402
from wordanchor.emphasis import Emphasizer  # noqa: E402
from wordanchor.i18n import MESSAGES, messages_for  # noqa: E402

STYLE = "test emphasis"


def emphasize(doc, strength=0.45, style="bold"):
    return writer.emphasize_document(doc, strength, style, STYLE, "Emphasize")


class EmphasizeDocument(unittest.TestCase):
    def test_paragraphs_and_tables(self):
        p1 = Paragraph("Reading is comfortable")
        p2 = Paragraph("l'àvia d'una amiga")
        cell = Paragraph("Table cell")
        doc = Document(Text(p1, Table(A1=Text(cell)), p2))
        self.assertEqual(emphasize(doc), 8)
        self.assertEqual(p1.styled(STYLE), "[Rea]ding [i]s [comfo]rtable")
        self.assertEqual(p2.styled(STYLE), "l'[àv]ia d'[u]na [am]iga")
        self.assertEqual(cell.styled(STYLE), "[Ta]ble [ce]ll")
        self.assertEqual(doc.family.getByName(STYLE).props, {"CharWeight": writer.BOLD})
        self.assertEqual(doc.log, [("enter", "Emphasize"), ("lock",), ("unlock",), ("leave",)])

    def test_words_continue_across_portions_and_bookmarks(self):
        # "Hello" is split by an italic portion and a bookmark; still one word.
        p = Paragraph(("Text", "Hel", ""), ("Bookmark",), ("Text", "lo world", ""))
        doc = Document(Text(p))
        emphasize(doc)
        self.assertEqual(p.styled(STYLE), "[He]llo [wo]rld")

    def test_fields_break_runs_and_are_never_styled(self):
        p = Paragraph("Page ", ("TextField", "7"), " of report")
        doc = Document(Text(p))
        emphasize(doc)
        self.assertEqual(p.styled(STYLE), "[Pa]ge 7 [o]f [rep]ort")

    def test_keeps_other_character_styles(self):
        p = Paragraph(("Text", "Emphasis ", "Strong Emphasis"), "stays")
        doc = Document(Text(p))
        emphasize(doc)
        self.assertEqual(p.styled(STYLE), "Emphasis [st]ays")
        self.assertEqual(p.styled("Strong Emphasis"), "[Emphasis ]stays")

    def test_reapplying_replaces_previous_emphasis(self):
        p = Paragraph("Reading is comfortable")
        doc = Document(Text(p))
        emphasize(doc)
        emphasize(doc, strength=0.7, style="underline")
        self.assertEqual(p.styled(STYLE), "[Readi]ng [i]s [comforta]ble")
        self.assertEqual(
            doc.family.getByName(STYLE).props, {"CharUnderline": writer.UNDERLINE_SINGLE}
        )

    def test_long_paragraphs_move_in_steps(self):
        p = Paragraph("x " * 40_000 + "final")
        doc = Document(Text(p))
        emphasize(doc)
        self.assertTrue(p.styled(STYLE).endswith("[fi]nal"))

    def test_empty_document(self):
        doc = Document(Text(Paragraph(), Paragraph(("TextField", "x"))))
        self.assertEqual(emphasize(doc), 0)

    def test_run_without_allowed_text(self):
        p = Paragraph(("Text", "Quote", "Quotation"))
        run = next(writer.text_runs(p))
        self.assertEqual(writer.emphasize_run(run, Emphasizer(), STYLE), 0)


class Remove(unittest.TestCase):
    def test_removes_exactly_and_drops_the_style(self):
        p = Paragraph(("Text", "Keep ", "Quotation"), "this text")
        doc = Document(Text(p))
        emphasize(doc)
        removed = writer.remove_document_emphasis(doc, STYLE, "Remove")
        self.assertGreater(removed, 0)
        self.assertEqual(p.styled(STYLE), "Keep this text")
        self.assertEqual(p.styled("Quotation"), "[Keep ]this text")
        self.assertFalse(doc.family.hasByName(STYLE))
        # Nothing to remove the second time.
        self.assertEqual(writer.remove_emphasis(doc, STYLE), 0)


class Restyle(unittest.TestCase):
    def test_switches_colour_only_when_emphasis_exists(self):
        doc = Document(Text(Paragraph("Some text")))
        writer.restyle(doc, "color", STYLE)
        self.assertFalse(doc.family.hasByName(STYLE))
        emphasize(doc)
        writer.restyle(doc, "color", STYLE)
        self.assertEqual(doc.family.getByName(STYLE).props, {"CharColor": writer.EMPHASIS_COLOR})


class EmphasizeSelection(unittest.TestCase):
    def test_no_selection(self):
        doc = Document(Text(Paragraph("Nothing")))
        self.assertEqual(writer.emphasize_selection(doc, 0.45, "bold", STYLE, "Sel"), -1)
        doc.select(Selection(doc.text, string=""))
        self.assertEqual(writer.emphasize_selection(doc, 0.45, "bold", STYLE, "Sel"), -1)
        doc.selection = object.__new__(type("Shape", (), {"supportsService": lambda _, n: False}))
        self.assertEqual(writer.emphasize_selection(doc, 0.45, "bold", STYLE, "Sel"), -1)

    def test_selected_paragraphs(self):
        p1, p2, p3 = Paragraph("First line"), Paragraph("Second line"), Paragraph("Third")
        text = Text(p1, p2, p3)
        doc = Document(text)
        doc.select(Selection(text, p2), Selection(text, Table(A1=Text(p3))))
        self.assertEqual(writer.emphasize_selection(doc, 0.45, "bold", STYLE, "Sel"), 3)
        self.assertEqual(p1.styled(STYLE), "First line")
        self.assertEqual(p2.styled(STYLE), "[Sec]ond [li]ne")
        self.assertEqual(p3.styled(STYLE), "[Th]ird")


class SettingsAndText(unittest.TestCase):
    def test_settings_round_trip(self):
        with tempfile.TemporaryDirectory() as folder:
            path = os.path.join(folder, "sub", "settings.json")
            self.assertEqual(settings.load(path), settings.Settings())
            settings.save(path, settings.Settings(strength=0.6, style="color"))
            self.assertEqual(settings.load(path), settings.Settings(strength=0.6, style="color"))
            with open(path, "w") as f:
                f.write("{broken")
            self.assertEqual(settings.load(path), settings.Settings())
        self.assertEqual(
            settings.parse({"strength": 9, "style": "blink"}), settings.Settings(0.7, "bold")
        )
        self.assertEqual(settings.parse(None), settings.Settings())

    def test_messages(self):
        keys = set(MESSAGES["en"])
        for lang, messages in MESSAGES.items():
            self.assertEqual(set(messages), keys, lang)
            self.assertTrue(all(v.strip() for v in messages.values()), lang)
        self.assertIs(messages_for("ca-ES"), MESSAGES["ca"])
        self.assertIs(messages_for("es_419"), MESSAGES["es"])
        self.assertIs(messages_for("ja"), MESSAGES["en"])
        self.assertIs(messages_for(None), MESSAGES["en"])
        for value in writer.STYLES:
            self.assertIn("style" + value.capitalize(), keys)
        for value in settings.STRENGTHS:
            self.assertIn("strength" + value.capitalize(), keys)


if __name__ == "__main__":
    unittest.main()
