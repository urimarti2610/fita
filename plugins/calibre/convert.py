#!/usr/bin/env python3
"""Converts an EPUB from the command line with the plugin's engine, without calibre.

    python3 plugins/calibre/convert.py book.epub book.fita.epub [--style bold] [--strength 0.45] [--every 1]
    python3 plugins/calibre/convert.py book.fita.epub book.epub --remove

Used by CI to validate the output with epubcheck.
"""

import argparse
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "plugin"))

from engine.emphasis import resolve_options  # noqa: E402
from engine.epub import convert_epub, remove_emphasis  # noqa: E402
from engine.markup import DEFAULT_STYLE, STYLES  # noqa: E402

parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
parser.add_argument("source")
parser.add_argument("target")
parser.add_argument("--style", choices=STYLES, default=DEFAULT_STYLE)
parser.add_argument("--strength", type=float)
parser.add_argument("--every", type=int)
parser.add_argument("--remove", action="store_true", help="remove emphasis instead")
args = parser.parse_args()
if args.remove:
    remove_emphasis(args.source, args.target)
else:
    options = resolve_options(strength=args.strength, every=args.every)
    convert_epub(args.source, args.target, options, args.style)
