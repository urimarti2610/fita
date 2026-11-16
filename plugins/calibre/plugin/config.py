"""Settings (stored by calibre in plugins/fita.json) and the configuration widget."""

from calibre.utils.config import JSONConfig
from qt.core import QComboBox, QFormLayout, QLabel, QSlider, QSpinBox, Qt, QVBoxLayout, QWidget

from calibre_plugins.fita.engine.brand import EMPHASIS_CLASS, ID, REST_CLASS
from calibre_plugins.fita.engine.emphasis import MAX_STRENGTH, MIN_STRENGTH, resolve_options
from calibre_plugins.fita.engine.markup import DEFAULT_STYLE, STYLES, create_markup_emphasizer

load_translations()  # noqa: F821 (calibre builtin)

prefs = JSONConfig(f"plugins/{ID}")
prefs.defaults["strength"] = 0.45
prefs.defaults["style"] = DEFAULT_STYLE
prefs.defaults["every"] = 1


def current_options():
    """The saved settings as (EmphasisOptions, style)."""
    style = prefs["style"] if prefs["style"] in STYLES else DEFAULT_STYLE
    return resolve_options(strength=prefs["strength"], every=prefs["every"]), style


def style_names():
    return {
        "bold-fade": _("Bold start, faded rest"),  # noqa: F821
        "bold": _("Bold"),  # noqa: F821
        "color": _("Colour"),  # noqa: F821
        "underline": _("Soft underline"),  # noqa: F821
        "fade": _("Faded rest of the word"),  # noqa: F821
    }


#: Inline approximations of the ebook stylesheet, for the preview label.
_PREVIEW_STYLES = {
    "bold-fade": ("font-weight:bold", "color:gray"),
    "bold": ("font-weight:bold", ""),
    "color": ("color:#1f5fa8", ""),
    "underline": ("text-decoration:underline", ""),
    "fade": ("", "color:gray"),
}


class ConfigWidget(QWidget):
    def __init__(self):
        QWidget.__init__(self)
        options, style = current_options()
        layout = QVBoxLayout(self)
        form = QFormLayout()
        layout.addLayout(form)

        self.strength = QSlider(Qt.Orientation.Horizontal, self)
        self.strength.setRange(round(MIN_STRENGTH * 100), round(MAX_STRENGTH * 100))
        self.strength.setSingleStep(5)
        self.strength.setPageStep(5)
        self.strength.setValue(round(options.strength * 100))
        self.strength_value = QLabel(self)
        strength_label = QLabel(_("&Strength"), self)  # noqa: F821
        strength_label.setBuddy(self.strength)
        row = QVBoxLayout()
        row.addWidget(self.strength)
        row.addWidget(self.strength_value)
        form.addRow(strength_label, row)

        self.style = QComboBox(self)
        for key, label in style_names().items():
            self.style.addItem(label, key)
        self.style.setCurrentIndex(STYLES.index(style))
        style_label = QLabel(_("St&yle"), self)  # noqa: F821
        style_label.setBuddy(self.style)
        form.addRow(style_label, self.style)

        self.every = QSpinBox(self)
        self.every.setRange(1, 10)
        self.every.setValue(options.every)
        every_label = QLabel(_("Emphasize one word in &every"), self)  # noqa: F821
        every_label.setBuddy(self.every)
        form.addRow(every_label, self.every)

        self.preview = QLabel(self)
        self.preview.setWordWrap(True)
        self.preview.setTextFormat(Qt.TextFormat.RichText)
        self.preview.setAccessibleName(_("Preview"))  # noqa: F821
        form.addRow(QLabel(_("Preview"), self), self.preview)  # noqa: F821

        note = QLabel(
            _(  # noqa: F821
                "The untouched book is kept as ORIGINAL_EPUB the first time. "
                "Converting again replaces the previous emphasis."
            ),
            self,
        )
        note.setWordWrap(True)
        layout.addWidget(note)
        layout.addStretch()

        self.strength.valueChanged.connect(self.update_preview)
        self.style.currentIndexChanged.connect(self.update_preview)
        self.every.valueChanged.connect(self.update_preview)
        self.update_preview()

    def values(self):
        return self.strength.value() / 100, self.style.currentData(), self.every.value()

    def update_preview(self, *_args):
        strength, style, every = self.values()
        self.strength_value.setText(f"{round(strength * 100)} %")
        emphasis, rest = _PREVIEW_STYLES[style]
        markup = create_markup_emphasizer(resolve_options(strength=strength, every=every), style)(
            _("Reading calmly, your way, with anchors that guide your eyes.")  # noqa: F821
        )
        markup = markup.replace(f'class="{EMPHASIS_CLASS}"', f'style="{emphasis}"')
        markup = markup.replace(f'class="{REST_CLASS}"', f'style="{rest}"')
        self.preview.setText(markup)

    def save_settings(self):
        strength, style, every = self.values()
        prefs["strength"] = strength
        prefs["style"] = style
        prefs["every"] = every
