#!/usr/bin/env python3
"""Builds the calibre plugin zip: plugins/calibre/dist/<id>-calibre-<version>.zip.

Standard library only. Compiles translations/*.po to .mo, checks that every
user-facing string is translated and that the import name matches the brand,
and writes a reproducible zip (fixed timestamps, sorted entries).

    python3 plugins/calibre/build.py          # build
    python3 plugins/calibre/build.py --check  # checks only, no zip
"""

import ast
import os
import re
import struct
import sys
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
PLUGIN = os.path.join(HERE, "plugin")
ROOT = os.path.dirname(os.path.dirname(HERE))
ICON = os.path.join(ROOT, "apps", "extension", "static", "icons", "icon-128.png")
STAMP = (2024, 1, 1, 0, 0, 0)

sys.path.insert(0, PLUGIN)
from engine.brand import ID  # noqa: E402


def read_po(path):
    """Parses a simple .po file (single-line or continued strings, no plurals)."""
    messages, msgid, msgstr, current = {}, None, None, None

    def flush():
        if msgid is not None and msgstr:
            messages[msgid] = msgstr

    for line in open(path, encoding="utf-8"):
        line = line.strip()
        if line.startswith("msgid "):
            flush()
            msgid, msgstr, current = ast.literal_eval(line[6:]), None, "id"
        elif line.startswith("msgstr "):
            msgstr, current = ast.literal_eval(line[7:]), "str"
        elif line.startswith('"'):
            if current == "id":
                msgid += ast.literal_eval(line)
            else:
                msgstr += ast.literal_eval(line)
    flush()
    return messages


def to_mo(messages):
    """GNU .mo binary for a {msgid: msgstr} catalog."""
    keys = sorted(messages)
    ids = [k.encode("utf-8") for k in keys]
    strs = [messages[k].encode("utf-8") for k in keys]
    header = 7 * 4
    table = header + 16 * len(keys)
    offsets, data = [], b""
    for chunk in ids + strs:
        offsets.append((len(chunk), table + len(data)))
        data += chunk + b"\0"
    out = struct.pack("<7I", 0x950412DE, 0, len(keys), header, header + 8 * len(keys), 0, 0)
    for length, offset in offsets:
        out += struct.pack("<2I", length, offset)
    return out + data


def source_strings():
    """Every literal passed to _() in the plugin's GUI modules."""
    found = set()
    for name in sorted(os.listdir(PLUGIN)):
        if name.endswith(".py"):
            tree = ast.parse(open(os.path.join(PLUGIN, name), encoding="utf-8").read())
            for node in ast.walk(tree):
                if isinstance(node, ast.Call) and getattr(node.func, "id", None) == "_":
                    found.add(node.args[0].value)
    return found


def check():
    errors = []
    init = open(os.path.join(PLUGIN, "__init__.py"), encoding="utf-8").read()
    if f'"calibre_plugins.{ID}.action:' not in init or f'name = "{ID}"' not in init:
        errors.append(f"__init__.py must use the import name and name '{ID}' (engine/brand.py)")
    for module in os.listdir(PLUGIN):
        if module.endswith(".py"):
            text = open(os.path.join(PLUGIN, module), encoding="utf-8").read()
            for used in set(re.findall(r"calibre_plugins\.(\w+)", text)) - {ID}:
                errors.append(f"{module}: imports calibre_plugins.{used}, expected {ID}")
    strings = source_strings()
    catalogs = {}
    for po in sorted(os.listdir(os.path.join(PLUGIN, "translations"))):
        if po.endswith(".po"):
            lang = po[:-3]
            catalogs[lang] = read_po(os.path.join(PLUGIN, "translations", po))
            for missing in sorted(strings - set(catalogs[lang])):
                errors.append(f"{po}: missing translation for {missing!r}")
            for unused in sorted(set(catalogs[lang]) - strings - {""}):
                errors.append(f"{po}: unused message {unused!r}")
    if errors:
        sys.exit("\n".join(errors))
    return catalogs


def version():
    m = re.search(r"version = \((\d+), (\d+), (\d+)\)", open(os.path.join(PLUGIN, "__init__.py")).read())
    return ".".join(m.groups())


def build(catalogs):
    dist = os.path.join(HERE, "dist")
    os.makedirs(dist, exist_ok=True)
    target = os.path.join(dist, f"{ID}-calibre-{version()}.zip")
    files = {f"plugin-import-name-{ID}.txt": b"", "images/icon.png": open(ICON, "rb").read()}
    for lang, messages in catalogs.items():
        files[f"translations/{lang}.mo"] = to_mo(messages)
    for folder, dirs, names in os.walk(PLUGIN):
        dirs[:] = [d for d in dirs if d != "__pycache__"]
        for name in names:
            if name.endswith(".py"):
                path = os.path.join(folder, name)
                files[os.path.relpath(path, PLUGIN).replace(os.sep, "/")] = open(path, "rb").read()
    with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED) as z:
        for name in sorted(files):
            info = zipfile.ZipInfo(name, STAMP)
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            z.writestr(info, files[name])
    return target


if __name__ == "__main__":
    catalogs = check()
    if "--check" not in sys.argv:
        print(build(catalogs))
