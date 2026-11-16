"""calibre plugin entry point. calibre loads this module as ``calibre_plugins.fita``.

The import name ``fita`` must match ``engine/brand.py`` (ID); build.py checks it.
"""

from calibre.customize import InterfaceActionBase

load_translations()  # noqa: F821 (calibre builtin: loads translations/<lang>.mo)


class FitaPlugin(InterfaceActionBase):
    name = "fita"
    description = _(  # noqa: F821 (calibre builtin)
        "Reading aids for ADHD and dyslexia: gently emphasizes the start of each word "
        "in your EPUB books. Everything happens on your computer."
    )
    supported_platforms = ["windows", "osx", "linux"]
    author = "Oriol Martí Collell"
    version = (0, 1, 0)
    minimum_calibre_version = (6, 0, 0)
    actual_plugin = "calibre_plugins.fita.action:FitaAction"

    def is_customizable(self):
        return True

    def config_widget(self):
        from calibre_plugins.fita.config import ConfigWidget

        return ConfigWidget()

    def save_settings(self, config_widget):
        config_widget.save_settings()
