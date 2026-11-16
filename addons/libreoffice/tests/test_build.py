"""Builds the .oxt and checks its contents, then runs the UNO component with stubs."""

import importlib.util
import os
import sys
import tempfile
import types
import unittest
import zipfile
from xml.etree import ElementTree

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(ROOT, "scripts"))
sys.path.insert(0, os.path.join(ROOT, "extension", "pythonpath"))

import build  # noqa: E402
from fake_writer import Document, Paragraph, Text  # noqa: E402
from wordanchor.i18n import MESSAGES  # noqa: E402

OOR = "{http://openoffice.org/2001/registry}"
XML_LANG = "{http://www.w3.org/XML/1998/namespace}lang"


class Build(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.path = build.build()
        cls.brand = build.read_brand()
        with zipfile.ZipFile(cls.path) as archive:
            cls.files = {name: archive.read(name) for name in archive.namelist()}

    def test_contents(self):
        expected = {
            "Addons.xcu",
            "LICENSE",
            "NOTICE",
            "META-INF/manifest.xml",
            "component.py",
            "description.xml",
            "icon.png",
            "pythonpath/wordanchor/__init__.py",
            "pythonpath/wordanchor/brand.py",
            "pythonpath/wordanchor/emphasis.py",
            "pythonpath/wordanchor/i18n.py",
            "pythonpath/wordanchor/settings.py",
            "pythonpath/wordanchor/writer.py",
        } | {f"description/description-{lang}.txt" for lang in MESSAGES}
        self.assertEqual(set(self.files), expected)
        self.assertTrue(self.path.endswith(f"{self.brand['ID']}-libreoffice-0.1.0.oxt"))

    def test_xml_is_well_formed(self):
        for name in ("Addons.xcu", "description.xml", "META-INF/manifest.xml"):
            ElementTree.fromstring(self.files[name])

    def test_menu_is_translated_and_points_to_the_component(self):
        root = ElementTree.fromstring(self.files["Addons.xcu"])
        urls = [v.text for v in root.iter("value") if v.text and v.text.startswith("service:")]
        self.assertEqual(len(urls), 9)
        self.assertTrue(all(u.startswith(f"service:{self.brand['IMPLEMENTATION']}?") for u in urls))
        langs = {v.get(XML_LANG) for v in root.iter("value")}
        self.assertTrue({"en", "es", "ca"} <= langs)
        self.assertIn("Destacar la selecció".encode(), self.files["Addons.xcu"])

    def test_component_registered(self):
        manifest = self.files["META-INF/manifest.xml"].decode()
        self.assertIn('full-path="component.py"', manifest)
        self.assertIn("uno-component;type=Python", manifest)
        description = self.files["description.xml"].decode()
        self.assertIn(self.brand["EXTENSION_ID"], description)
        self.assertIn('version value="0.1.0"', description)

    def test_reproducible(self):
        with open(self.path, "rb") as f:
            first = f.read()
        with open(build.build(), "rb") as f:
            self.assertEqual(f.read(), first)


def load_component(brand, user_dir, locale="ca"):
    """Imports component.py with stand-ins for the pyuno modules."""
    stubs = {
        "uno": types.SimpleNamespace(
            createUnoStruct=lambda name: types.SimpleNamespace(),
            fileUrlToSystemPath=lambda url: url,
        ),
        "unohelper": types.SimpleNamespace(
            Base=type("Base", (), {}),
            ImplementationHelper=lambda: types.SimpleNamespace(
                addImplementation=lambda *a: stubs.setdefault("registered", a)
            ),
        ),
        "com": types.ModuleType("com"),
        "com.sun": types.ModuleType("com.sun"),
        "com.sun.star": types.ModuleType("com.sun.star"),
        "com.sun.star.awt": types.ModuleType("com.sun.star.awt"),
        "com.sun.star.awt.MessageBoxButtons": types.SimpleNamespace(BUTTONS_OK=1),
        "com.sun.star.awt.MessageBoxType": types.SimpleNamespace(INFOBOX="info"),
        "com.sun.star.task": types.SimpleNamespace(XJobExecutor=type("XJobExecutor", (), {})),
        "wordanchor.brand": types.SimpleNamespace(**brand),
    }
    saved = {name: sys.modules.get(name) for name in stubs}
    sys.modules.update(stubs)
    import wordanchor

    wordanchor.brand = stubs["wordanchor.brand"]
    try:
        spec = importlib.util.spec_from_file_location(
            "component_under_test", os.path.join(ROOT, "extension", "component.py")
        )
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
    finally:
        for name, value in saved.items():
            if value is None:
                sys.modules.pop(name, None)
            else:
                sys.modules[name] = value
        del wordanchor.brand

    messages = []
    services = {}

    class Box:
        def __init__(self, *args):
            self.args = args

        def execute(self):
            messages.append(self.args[-1])

    def create(name, ctx):
        return services[name]

    ctx = types.SimpleNamespace(
        getServiceManager=lambda: types.SimpleNamespace(createInstanceWithContext=create)
    )
    services["com.sun.star.configuration.ConfigurationProvider"] = types.SimpleNamespace(
        createInstanceWithArguments=lambda *a: types.SimpleNamespace(getByName=lambda n: locale)
    )
    services["com.sun.star.util.PathSubstitution"] = types.SimpleNamespace(
        substituteVariables=lambda v, s: user_dir
    )
    services["com.sun.star.awt.Toolkit"] = types.SimpleNamespace(createMessageBox=Box)
    return module, ctx, services, messages, stubs


class Component(unittest.TestCase):
    def test_menu_commands(self):
        brand = build.read_brand()
        with tempfile.TemporaryDirectory() as user:
            module, ctx, services, messages, stubs = load_component(brand, user)
            self.assertEqual(stubs["registered"][1], brand["IMPLEMENTATION"])
            paragraph = Paragraph("Reading is comfortable")
            doc = Document(Text(paragraph))
            frame = types.SimpleNamespace(getContainerWindow=lambda: None)
            services["com.sun.star.frame.Desktop"] = types.SimpleNamespace(
                getCurrentComponent=lambda: doc, getCurrentFrame=lambda: frame
            )
            job = module.Emphasis(ctx)
            style = brand["STYLE_NAME"]

            job.trigger("strength:stronger")
            self.assertEqual(messages[-1], MESSAGES["ca"]["strengthSet"].format(value="més intensa"))
            job.trigger("document")
            self.assertEqual(paragraph.styled(style), "[Read]ing [i]s [comfort]able")
            job.trigger("style:color")
            self.assertIn("CharColor", doc.family.getByName(style).props)
            job.trigger("selection")
            self.assertEqual(messages[-1], MESSAGES["ca"]["noSelection"])
            job.trigger("remove")
            self.assertEqual(paragraph.styled(style), "Reading is comfortable")
            job.trigger("style:blink")  # ignored
            self.assertEqual(len(messages), 3)
            self.assertTrue(os.path.exists(os.path.join(user, f"{brand['ID']}-settings.json")))

            # Not a text document: nothing happens.
            services["com.sun.star.frame.Desktop"] = types.SimpleNamespace(
                getCurrentComponent=lambda: None
            )
            job.trigger("document")

    def test_locale_falls_back_to_english(self):
        with tempfile.TemporaryDirectory() as user:
            module, ctx, services, _, _ = load_component(build.read_brand(), user)
            del services["com.sun.star.configuration.ConfigurationProvider"]
            self.assertEqual(module.ui_locale(ctx), "en")


if __name__ == "__main__":
    unittest.main()
