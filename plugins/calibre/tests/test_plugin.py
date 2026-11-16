"""Smoke test of the calibre-facing modules with calibre and Qt stubbed out.

It catches import errors, wrong names and broken job logic without installing
calibre. The real integration is checked by hand (see README.md).
"""

import builtins
import importlib.util
import os
import sys
import tempfile
import types
import unittest
from unittest import mock

HERE = os.path.dirname(__file__)
PLUGIN = os.path.join(HERE, "..", "plugin")
sys.path.insert(0, HERE)

from test_epub import make_epub  # noqa: E402


class JSONConfig(dict):
    def __init__(self, name):
        super().__init__()
        self.defaults = {}

    def __missing__(self, key):
        return self.defaults[key]


def install_stubs():
    modules = {
        "calibre": {},
        "calibre.customize": {"InterfaceActionBase": object},
        "calibre.gui2": {"Dispatcher": lambda f: f, "error_dialog": mock.Mock()},
        "calibre.gui2.actions": {"InterfaceAction": object},
        "calibre.gui2.threaded_jobs": {"ThreadedJob": mock.Mock()},
        "calibre.utils": {},
        "calibre.utils.config": {"JSONConfig": JSONConfig},
        "qt": {},
        "qt.core": {
            n: mock.Mock()
            for n in "QComboBox QFormLayout QLabel QMenu QSlider QSpinBox Qt QVBoxLayout".split()
        },
    }
    modules["qt.core"]["QWidget"] = object
    for name, attrs in modules.items():
        module = types.ModuleType(name)
        module.__dict__.update(attrs)
        sys.modules[name] = module
    builtins._ = lambda s: s
    builtins.load_translations = lambda *a: None
    sys.modules["calibre_plugins"] = types.ModuleType("calibre_plugins")
    sys.modules["calibre_plugins"].__path__ = []
    spec = importlib.util.spec_from_file_location(
        "calibre_plugins.fita",
        os.path.join(PLUGIN, "__init__.py"),
        submodule_search_locations=[PLUGIN],
    )
    package = importlib.util.module_from_spec(spec)
    sys.modules["calibre_plugins.fita"] = package
    spec.loader.exec_module(package)
    return package


class PluginModules(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.package = install_stubs()

    def test_entry_point(self):
        self.assertEqual(self.package.FitaPlugin.actual_plugin, "calibre_plugins.fita.action:FitaAction")
        self.assertTrue(self.package.FitaPlugin().is_customizable())

    def test_settings(self):
        from calibre_plugins.fita.config import current_options, prefs

        options, style = current_options()
        self.assertEqual((options.strength, options.every, style), (0.45, 1, "bold-fade"))
        prefs["style"] = "unknown"
        prefs["strength"] = 9
        options, style = current_options()
        self.assertEqual((options.strength, style), (0.7, "bold-fade"))

    def test_job(self):
        from calibre_plugins.fita.action import _work
        from calibre_plugins.fita.engine.emphasis import resolve_options

        with tempfile.TemporaryDirectory() as tmp:
            good = os.path.join(tmp, "1.epub")
            bad = os.path.join(tmp, "2.epub")
            make_epub(good)
            with open(bad, "wb") as f:
                f.write(b"not a zip")
            notifications = mock.Mock()
            done, failed = _work(
                [(1, "Good", good), (2, "Bad", bad)],
                "add",
                resolve_options(),
                "bold",
                abort=mock.Mock(is_set=lambda: False),
                log=mock.Mock(),
                notifications=notifications,
            )
            self.assertEqual(done, [(1, f"{good}.out.epub")])
            self.assertEqual(failed, [("Bad", "invalid")])
            self.assertTrue(os.path.exists(f"{good}.out.epub"))
            notifications.put.assert_called()


if __name__ == "__main__":
    unittest.main()
