#!/usr/bin/env python3
"""Builds the KOReader plugin zip: plugins/koreader/dist/fita-koreader-<version>.zip.

The zip holds the fita.koplugin folder, ready to unzip into KOReader's plugins
folder. Standard library only; reproducible (fixed timestamps, sorted entries).

    python3 plugins/koreader/build.py [version]
"""

import os
import sys
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
PLUGIN = "fita.koplugin"
VERSION = "0.1.0"
STAMP = (2024, 1, 1, 0, 0, 0)


def main():
    version = sys.argv[1] if len(sys.argv) > 1 else VERSION
    dist = os.path.join(HERE, "dist")
    os.makedirs(dist, exist_ok=True)
    target = os.path.join(dist, f"fita-koreader-{version}.zip")
    root = os.path.join(HERE, PLUGIN)
    names = sorted(n for n in os.listdir(root) if n.endswith(".lua"))
    with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED) as z:
        for name in names + ["LICENSE"]:
            source = os.path.join(root, name) if name != "LICENSE" else os.path.join(HERE, "..", "..", "LICENSE")
            info = zipfile.ZipInfo(f"{PLUGIN}/{name}", STAMP)
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            with open(source, "rb") as f:
                z.writestr(info, f.read())
    print(target)


if __name__ == "__main__":
    main()
