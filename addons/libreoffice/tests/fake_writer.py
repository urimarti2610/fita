"""A tiny in-memory Writer model with just the UNO calls wordanchor.writer uses."""

from __future__ import annotations


class _Enumeration:
    def __init__(self, items):
        self._items = list(items)

    def hasMoreElements(self):
        return bool(self._items)

    def nextElement(self):
        return self._items.pop(0)


class _Services:
    services: tuple = ()

    def supportsService(self, name):
        return name in self.services


class Cell:
    """One character position: a text character (with a char style) or a field."""

    def __init__(self, char, kind="Text", style=""):
        self.char = char
        self.kind = kind
        self.style = style


class Paragraph(_Services):
    services = ("com.sun.star.text.Paragraph",)

    def __init__(self, *parts):
        """Parts: plain strings (text), ("Text", str, style), ("TextField", str) or
        ("Bookmark",) for zero-width marks."""
        self.cells = []
        self.marks = {}  # cell index -> zero-width portion kinds before it
        for part in parts:
            if isinstance(part, str):
                part = ("Text", part, "")
            kind = part[0]
            if kind == "Text":
                self.cells += [Cell(c, "Text", part[2]) for c in part[1]]
            elif kind == "Bookmark":
                self.marks.setdefault(len(self.cells), []).append(kind)
            else:
                self.cells.append(Cell(part[1], kind))
        self.text = None

    def string(self):
        return "".join(c.char for c in self.cells)

    def styled(self, style_name):
        """The text with characters in `style_name` in [brackets]."""
        out = ""
        for i, cell in enumerate(self.cells):
            on = cell.style == style_name
            before = i > 0 and self.cells[i - 1].style == style_name
            after = i + 1 < len(self.cells) and self.cells[i + 1].style == style_name
            out += ("[" if on and not before else "") + cell.char + ("]" if on and not after else "")
        return out

    def _portions(self):
        i = 0
        out = []
        while i <= len(self.cells):
            for kind in self.marks.get(i, []):
                out.append(Portion(self, i, i, kind))
            if i == len(self.cells):
                break
            cell = self.cells[i]
            j = i + 1
            if cell.kind == "Text":
                while (
                    j < len(self.cells)
                    and self.cells[j].kind == "Text"
                    and self.cells[j].style == cell.style
                    and j not in self.marks
                ):
                    j += 1
            out.append(Portion(self, i, j, cell.kind))
            i = j
        return out

    def createEnumeration(self):
        return _Enumeration(self._portions())


class Position:
    def __init__(self, paragraph, offset):
        self.paragraph = paragraph
        self.offset = offset


class Portion:
    def __init__(self, paragraph, start, end, kind):
        self.paragraph = paragraph
        self.start = start
        self.end = end
        self.kind = kind

    def getPropertyValue(self, name):
        if name == "TextPortionType":
            return self.kind
        if name == "CharStyleName":
            if self.kind != "Text":
                raise AttributeError(name)
            return self.paragraph.cells[self.start].style
        raise KeyError(name)

    def setPropertyToDefault(self, name):
        assert name == "CharStyleName"
        for cell in self.paragraph.cells[self.start : self.end]:
            cell.style = ""

    def getString(self):
        return "".join(c.char for c in self.paragraph.cells[self.start : self.end])

    def getText(self):
        return self.paragraph.text

    def getStart(self):
        return Position(self.paragraph, self.start)


class Cursor(_Services):
    def __init__(self, position, container=None):
        self.paragraph = position.paragraph if position else None
        self.start = self.end = position.offset if position else 0
        self.container = container
        self.moves = []

    def goRight(self, count, expand):
        assert 0 < count <= 32767
        self.moves.append(count)
        self.end += count
        if not expand:
            self.start = self.end

    def collapseToEnd(self):
        self.start = self.end

    def setPropertyValue(self, name, value):
        assert name == "CharStyleName"
        for cell in self.paragraph.cells[self.start : self.end]:
            assert cell.kind == "Text", "styled a non-text character"
            cell.style = value

    def createEnumeration(self):
        return self.container.createEnumeration()


class Text(_Services):
    """A body text or table cell: a list of paragraphs and tables."""

    def __init__(self, *elements):
        self.elements = list(elements)
        self.cursors = []
        for element in elements:
            if isinstance(element, Paragraph):
                element.text = self

    def createEnumeration(self):
        return _Enumeration(self.elements)

    def createTextCursorByRange(self, position):
        if isinstance(position, Selection):
            return Cursor(None, position)
        cursor = Cursor(position)
        self.cursors.append(cursor)
        return cursor


class Table(_Services):
    services = ("com.sun.star.text.TextTable",)

    def __init__(self, **cells):
        self.cells = cells

    def getCellNames(self):
        return tuple(self.cells)

    def getCellByName(self, name):
        return self.cells[name]


class Selection:
    """A selected range: enumerating its cursor yields the given paragraphs."""

    def __init__(self, text, *paragraphs, string="selected"):
        self.text = text
        self.paragraphs = paragraphs
        self.string = string

    def getString(self):
        return self.string

    def getText(self):
        return self.text

    def createEnumeration(self):
        return _Enumeration(self.paragraphs)


class _Ranges(_Services):
    services = ("com.sun.star.text.TextRanges",)

    def __init__(self, ranges):
        self.ranges = ranges

    def getCount(self):
        return len(self.ranges)

    def getByIndex(self, i):
        return self.ranges[i]


class CharStyle:
    def __init__(self):
        self.props = {}

    def setPropertyToDefault(self, name):
        self.props.pop(name, None)

    def setPropertyValue(self, name, value):
        self.props[name] = value


class _Family:
    def __init__(self):
        self.styles = {}

    def hasByName(self, name):
        return name in self.styles

    def insertByName(self, name, style):
        self.styles[name] = style

    def getByName(self, name):
        return self.styles[name]

    def removeByName(self, name):
        del self.styles[name]


class Document(_Services):
    services = ("com.sun.star.text.TextDocument",)

    def __init__(self, text):
        self.text = text
        self.family = _Family()
        self.selection = None
        self.log = []

    def getText(self):
        return self.text

    def getStyleFamilies(self):
        families = {"CharacterStyles": self.family}
        return type("Families", (), {"getByName": lambda _, n: families[n]})()

    def createInstance(self, name):
        assert name == "com.sun.star.style.CharacterStyle"
        return CharStyle()

    def select(self, *ranges):
        self.selection = _Ranges(list(ranges))

    def getCurrentController(self):
        doc = self
        return type("Controller", (), {"getSelection": lambda _: doc.selection})()

    def getUndoManager(self):
        log = self.log
        return type(
            "Undo",
            (),
            {
                "enterUndoContext": lambda _, t: log.append(("enter", t)),
                "leaveUndoContext": lambda _: log.append(("leave",)),
            },
        )()

    def lockControllers(self):
        self.log.append(("lock",))

    def unlockControllers(self):
        self.log.append(("unlock",))
