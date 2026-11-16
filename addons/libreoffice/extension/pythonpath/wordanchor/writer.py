"""Applies and removes emphasis in a Writer document through the UNO API.

Emphasis is a character style: the emphasized start of each word gets the style
"<name> emphasis" and nothing else changes. That keeps it reversible and editable:

* "Remove emphasis" resets exactly those characters, and the author's own direct
  formatting (bold, colours…) is never touched;
* changing the style (bold, colour, underline) restyles the whole document at once,
  and users can even edit the style themselves in the Styles sidebar.

Only duck-typed UNO calls are used here, so the module is tested with fakes.
"""

from __future__ import annotations

from typing import Iterable, Iterator, List, Optional

from .emphasis import Emphasizer, clip, emphasized_intervals, resolve_options

STYLES = ("bold", "color", "underline")

# com.sun.star.awt.FontWeight.BOLD / NORMAL and FontUnderline.SINGLE.
BOLD = 150.0
UNDERLINE_SINGLE = 1
# Dark blue with at least 7:1 contrast on white paper.
EMPHASIS_COLOR = 0x1F4FAE
STYLE_PROPERTIES = ("CharWeight", "CharColor", "CharUnderline")

# Character style names that mean "no character style".
NO_STYLE = {"", "Standard", "Default Style", "Default Character Style"}
# Text portions that take up no characters, so a run of text continues across them.
ZERO_WIDTH_PORTIONS = {
    "Bookmark",
    "ReferenceMark",
    "DocumentIndexMark",
    "Redline",
    "SoftPageBreak",
    "InContentMetadata",
}
# XTextCursor.goRight takes a 16-bit count.
MAX_MOVE = 32767


def _each(enumeration_access) -> Iterator:
    enumeration = enumeration_access.createEnumeration()
    while enumeration.hasMoreElements():
        yield enumeration.nextElement()


def paragraphs(container) -> Iterator:
    """Paragraphs of a text (or of a selection cursor), including inside tables."""
    for element in _each(container):
        if element.supportsService("com.sun.star.text.TextTable"):
            for name in element.getCellNames():
                yield from paragraphs(element.getCellByName(name))
        elif element.supportsService("com.sun.star.text.Paragraph"):
            yield element


def text_runs(paragraph) -> Iterator[List]:
    """Groups a paragraph's text portions into runs of contiguous characters.

    Fields, footnote anchors and frames break a run; bookmarks and other zero-width
    marks do not, so a bookmark in the middle of a word keeps the word whole.
    """
    run: List = []
    for portion in _each(paragraph):
        kind = portion.getPropertyValue("TextPortionType")
        if kind == "Text":
            run.append(portion)
        elif kind not in ZERO_WIDTH_PORTIONS and run:
            yield run
            run = []
    if run:
        yield run


def _char_style(portion) -> str:
    try:
        return portion.getPropertyValue("CharStyleName") or ""
    except Exception:  # noqa: BLE001 - some portions have no character properties
        return ""


def _move(cursor, count: int, expand: bool) -> None:
    while count > 0:
        step = min(count, MAX_MOVE)
        cursor.goRight(step, expand)
        count -= step


def emphasize_run(run: List, emphasizer: Emphasizer, style_name: str) -> int:
    """Applies the emphasis style to one run. Returns the number of emphasized parts."""
    strings = [portion.getString() for portion in run]
    intervals = emphasized_intervals(emphasizer("".join(strings)))
    # Leave text that already has another character style alone.
    allowed = []
    offset = 0
    for portion, string in zip(run, strings):
        if _char_style(portion) in NO_STYLE or _char_style(portion) == style_name:
            allowed.extend(clip(intervals, offset, offset + len(string)))
        offset += len(string)
    if not allowed:
        return 0
    first = run[0]
    cursor = first.getText().createTextCursorByRange(first.getStart())
    position = 0
    for start, end in allowed:
        _move(cursor, start - position, False)
        _move(cursor, end - start, True)
        cursor.setPropertyValue("CharStyleName", style_name)
        cursor.collapseToEnd()
        position = end
    return len(allowed)


def emphasize_paragraphs(paragraph_list: Iterable, strength: float, style_name: str) -> int:
    emphasizer = Emphasizer(resolve_options(strength=strength))
    count = 0
    for paragraph in paragraph_list:
        for run in text_runs(paragraph):
            count += emphasize_run(run, emphasizer, style_name)
    return count


def ensure_style(doc, style_name: str, style: str):
    """Creates or updates the emphasis character style."""
    family = doc.getStyleFamilies().getByName("CharacterStyles")
    if not family.hasByName(style_name):
        family.insertByName(style_name, doc.createInstance("com.sun.star.style.CharacterStyle"))
    char_style = family.getByName(style_name)
    for name in STYLE_PROPERTIES:
        char_style.setPropertyToDefault(name)
    if style == "color":
        char_style.setPropertyValue("CharColor", EMPHASIS_COLOR)
    elif style == "underline":
        char_style.setPropertyValue("CharUnderline", UNDERLINE_SINGLE)
    else:
        char_style.setPropertyValue("CharWeight", BOLD)
    return char_style


def selected_paragraphs(doc) -> Optional[List]:
    """Paragraphs (clipped to the selection) of every selected text range, or None."""
    selection = doc.getCurrentController().getSelection()
    if selection is None or not selection.supportsService("com.sun.star.text.TextRanges"):
        return None
    out: List = []
    for i in range(selection.getCount()):
        selected = selection.getByIndex(i)
        if not selected.getString():
            continue
        cursor = selected.getText().createTextCursorByRange(selected)
        out.extend(paragraphs(cursor))
    return out or None


def remove_emphasis(doc, style_name: str) -> int:
    """Resets the emphasis style everywhere in the body and removes the style."""
    removed = 0
    for paragraph in paragraphs(doc.getText()):
        for portion in _each(paragraph):
            if _char_style(portion) == style_name:
                portion.setPropertyToDefault("CharStyleName")
                removed += 1
    family = doc.getStyleFamilies().getByName("CharacterStyles")
    if family.hasByName(style_name):
        family.removeByName(style_name)
    return removed


class _UndoGroup:
    """Groups all changes into one undo step and pauses screen updates."""

    def __init__(self, doc, title: str):
        self.doc = doc
        self.title = title

    def __enter__(self):
        self.doc.getUndoManager().enterUndoContext(self.title)
        self.doc.lockControllers()
        return self

    def __exit__(self, *exc):
        self.doc.unlockControllers()
        self.doc.getUndoManager().leaveUndoContext()
        return False


def emphasize_document(doc, strength: float, style: str, style_name: str, undo_title: str) -> int:
    with _UndoGroup(doc, undo_title):
        remove_emphasis(doc, style_name)
        ensure_style(doc, style_name, style)
        return emphasize_paragraphs(paragraphs(doc.getText()), strength, style_name)


def emphasize_selection(doc, strength: float, style: str, style_name: str, undo_title: str) -> int:
    """Returns -1 when no text is selected."""
    selected = selected_paragraphs(doc)
    if selected is None:
        return -1
    with _UndoGroup(doc, undo_title):
        ensure_style(doc, style_name, style)
        return emphasize_paragraphs(selected, strength, style_name)


def remove_document_emphasis(doc, style_name: str, undo_title: str) -> int:
    with _UndoGroup(doc, undo_title):
        return remove_emphasis(doc, style_name)


def restyle(doc, style: str, style_name: str) -> None:
    """Switches bold / colour / underline for the emphasis already in the document."""
    family = doc.getStyleFamilies().getByName("CharacterStyles")
    if family.hasByName(style_name):
        ensure_style(doc, style_name, style)
