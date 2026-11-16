#!/usr/bin/env python3
"""Build the emphasis font: a regular font whose `calt` feature draws the start
of each word with bold glyphs, without changing the text.

How it works:

1. Every letter glyph of the bold source font is copied into the regular font
   as `<name>.emph` (outlines and advance widths from the bold font).
2. A `calt` lookup finds word starts and replaces the first N letters with their
   `.emph` alternates. N follows `emphasisCount` in packages/core/src/emphasize.ts
   with the default options (strength 0.45, minWordLength 4) for words of up to
   MAX_WORD letters; longer words get the value for MAX_WORD.

The text itself is never touched: copy, search and screen readers see the same
characters. Run `python fonts/build.py`; the output goes to fonts/dist/.
"""

from __future__ import annotations

import argparse
import copy
import math
import re
import unicodedata
from pathlib import Path

from fontTools.feaLib.builder import addOpenTypeFeaturesFromString
from fontTools.ttLib import TTFont, newTable
from fontTools.ttLib.tables import otTables as ot
from fontTools.ttLib.tables.ttProgram import Program

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
SRC_REGULAR = HERE / "src" / "AtkinsonHyperlegibleNext-Regular.ttf"
SRC_BOLD = HERE / "src" / "AtkinsonHyperlegibleNext-Bold.ttf"
BRAND_FILE = ROOT / "packages" / "core" / "src" / "brand.ts"

FONT_VERSION = "1.000"
SUFFIX = ".emph"

# Same defaults as DEFAULT_OPTIONS in packages/core/src/emphasize.ts.
STRENGTH = 0.45
MIN_WORD_LENGTH = 4
# Longest word whose length the font tells apart. OpenType rules need one
# lookahead slot per letter; beyond this, words get the emphasis of MAX_WORD.
MAX_WORD = 30
# Shortest word after an elided article (l'àvia, d'una) that gets the emphasis on
# the main word instead of the article, as ELISION does in the core.
MIN_ELISION_BODY = 3

APOSTROPHES = ["quotesingle", "quoteright"]
# Characters that keep a word together (don't, col·lecció), like Intl.Segmenter.
JOINER_PREFIXES = APOSTROPHES + ["periodcentered"]


def emphasis_count(length: int) -> int:
    """Port of emphasisCount() in packages/core/src/emphasize.ts (default options)."""
    if length <= 0:
        return 0
    if length < MIN_WORD_LENGTH:
        return 1
    # JavaScript Math.round rounds halves up; Python's round() does not.
    n = max(1, math.floor(length * STRENGTH + 0.5))
    return min(n, length - 1) if length >= 2 else n


def brand_family() -> str:
    """Font family name, derived from the central brand name (BRAND.name)."""
    match = re.search(r'name:\s*"([^"]+)"', BRAND_FILE.read_text(encoding="utf-8"))
    name = match.group(1) if match else "fita"
    return f"{name[:1].upper()}{name[1:]} Sans"


# --- Glyph sets ---------------------------------------------------------------


def glyph_class(font: TTFont, glyph: str) -> int:
    return font["GDEF"].table.GlyphClassDef.classDefs.get(glyph, 0)


def single_substitutions(font: TTFont, feature_tags: set[str]):
    """Yields (input, output) of single substitutions reachable from the features."""
    gsub = font["GSUB"].table
    lookups = gsub.LookupList.Lookup
    todo = {
        i
        for rec in gsub.FeatureList.FeatureRecord
        if rec.FeatureTag in feature_tags
        for i in rec.Feature.LookupListIndex
    }
    seen: set[int] = set()
    while todo:
        index = todo.pop()
        if index in seen:
            continue
        seen.add(index)
        lookup = lookups[index]
        for sub in lookup.SubTable:
            if lookup.LookupType == 7:
                sub = sub.ExtSubTable
            if lookup.LookupType == 1:
                yield from sub.mapping.items()
            for rec in getattr(sub, "SubstLookupRecord", None) or []:
                todo.add(rec.LookupListIndex)


def letter_glyphs(font: TTFont) -> list[str]:
    """Base glyphs of letters, including localized forms (i.loclTRK and similar)."""
    letters = {
        glyph
        for code, glyph in font.getBestCmap().items()
        if unicodedata.category(chr(code)).startswith("L") and glyph_class(font, glyph) != 3
    }
    for source, target in single_substitutions(font, {"ccmp", "locl"}):
        if source in letters and glyph_class(font, target) != 3:
            letters.add(target)
    order = font.getGlyphOrder()
    return sorted(letters, key=order.index)


def digit_glyphs(font: TTFont) -> list[str]:
    digits = {
        glyph
        for code, glyph in font.getBestCmap().items()
        if unicodedata.category(chr(code)) == "Nd"
    }
    digits |= {target for source, target in single_substitutions(font, {"tnum", "pnum"})
               if source in digits}
    return sorted(digits)


def joiner_glyphs(font: TTFont, prefixes: list[str]) -> list[str]:
    return [g for g in font.getGlyphOrder() if g.split(".")[0] in prefixes]


def with_components(font: TTFont, glyphs: list[str]) -> list[str]:
    """Adds the components of composite glyphs, recursively."""
    glyf = font["glyf"]
    result: list[str] = []
    seen: set[str] = set()

    def visit(name: str) -> None:
        if name in seen:
            return
        seen.add(name)
        glyph = glyf[name]
        if glyph.isComposite():
            for component in glyph.components:
                visit(component.glyphName)
        result.append(name)

    for name in glyphs:
        visit(name)
    return result


# --- Merging the bold glyphs -------------------------------------------------


def add_emphasis_glyphs(font: TTFont, bold: TTFont, names: list[str]) -> dict[str, str]:
    """Copies bold glyphs into `font` as `<name>.emph`. Returns {name: emph name}."""
    position = {name: i for i, name in enumerate(font.getGlyphOrder())}
    # Same relative order as the plain glyphs keeps coverage tables sorted.
    names = sorted(names, key=position.__getitem__)
    emph = {name: name + SUFFIX for name in names}
    order = font.getGlyphOrder() + [emph[n] for n in names]
    glyf, hmtx = font["glyf"], font["hmtx"]
    bold_glyf, bold_hmtx = bold["glyf"], bold["hmtx"]
    for name in names:
        glyph = copy.deepcopy(bold_glyf[name])
        if glyph.isComposite():
            for component in glyph.components:
                component.glyphName = emph[component.glyphName]
        glyf.glyphs[emph[name]] = glyph
        hmtx.metrics[emph[name]] = bold_hmtx.metrics[name]
    font.setGlyphOrder(order)
    glyf.setGlyphOrder(order)
    class_defs = font["GDEF"].table.GlyphClassDef.classDefs
    for name in names:
        if name in class_defs:
            class_defs[emph[name]] = class_defs[name]
    return emph


def remove_hinting(font: TTFont) -> None:
    """TrueType hints of the bold glyphs refer to the bold font's own tables, so
    they cannot be mixed with the regular hints. Ship the font unhinted, like most
    modern web fonts: every current system renders it with its own smoothing."""
    for tag in ("fpgm", "prep", "cvt ", "hdmx", "LTSH", "VDMX"):
        if tag in font:
            del font[tag]
    glyf = font["glyf"]
    for name in font.getGlyphOrder():
        glyph = glyf[name]
        if hasattr(glyph, "program"):
            glyph.program = Program()
            glyph.program.fromBytecode(b"")
    gasp = newTable("gasp")
    gasp.version = 1
    gasp.gaspRange = {0xFFFF: 0x000F}
    font["gasp"] = gasp
    maxp = font["maxp"]
    for attr in ("maxZones", "maxTwilightPoints", "maxStorage", "maxFunctionDefs",
                 "maxInstructionDefs", "maxStackElements", "maxSizeOfInstructions"):
        setattr(maxp, attr, 1 if attr == "maxZones" else 0)


def extend_gpos(font: TTFont, bold: TTFont, emph: dict[str, str]) -> None:
    """Gives the `.emph` glyphs kerning (same classes as their plain glyph) and
    mark attachment (anchors from the bold font), so accents and kerning still work."""
    order = font.getGlyphOrder()
    gid = {name: i for i, name in enumerate(order)}
    lookups = font["GPOS"].table.LookupList.Lookup
    bold_lookups = bold["GPOS"].table.LookupList.Lookup
    for index, lookup in enumerate(lookups):
        for sub_index, sub in enumerate(lookup.SubTable):
            if lookup.LookupType == 2 and sub.Format == 1:
                extend_pair_pos_1(sub, emph, gid)
            elif lookup.LookupType == 2 and sub.Format == 2:
                extend_pair_pos_2(sub, emph)
            elif lookup.LookupType == 4:
                bold_sub = bold_lookups[index].SubTable[sub_index]
                extend_mark_base(sub, bold_sub, emph)


def extend_pair_pos_1(sub, emph: dict[str, str], gid: dict[str, int]) -> None:
    for pair_set in sub.PairSet:
        extra = []
        for record in pair_set.PairValueRecord:
            if record.SecondGlyph in emph:
                twin = copy.deepcopy(record)
                twin.SecondGlyph = emph[record.SecondGlyph]
                extra.append(twin)
        pair_set.PairValueRecord.extend(extra)
        pair_set.PairValueRecord.sort(key=lambda r: gid[r.SecondGlyph])
        pair_set.PairValueCount = len(pair_set.PairValueRecord)
    firsts = list(zip(sub.Coverage.glyphs, sub.PairSet, strict=True))
    firsts += [(emph[g], copy.deepcopy(ps)) for g, ps in firsts if g in emph]
    firsts.sort(key=lambda item: gid[item[0]])
    sub.Coverage.glyphs = [g for g, _ in firsts]
    sub.PairSet = [ps for _, ps in firsts]
    sub.PairSetCount = len(sub.PairSet)


def extend_pair_pos_2(sub, emph: dict[str, str]) -> None:
    sub.Coverage.glyphs += [emph[g] for g in sub.Coverage.glyphs if g in emph]
    for class_def in (sub.ClassDef1, sub.ClassDef2):
        defs = class_def.classDefs
        for name, value in list(defs.items()):
            if name in emph:
                defs[emph[name]] = value


def extend_mark_base(sub, bold_sub, emph: dict[str, str]) -> None:
    bold_bases = dict(zip(bold_sub.BaseCoverage.glyphs, bold_sub.BaseArray.BaseRecord,
                          strict=True))
    same_classes = bold_sub.ClassCount == sub.ClassCount
    glyphs = list(sub.BaseCoverage.glyphs)
    records = list(sub.BaseArray.BaseRecord)
    for name, record in zip(sub.BaseCoverage.glyphs, sub.BaseArray.BaseRecord, strict=True):
        if name not in emph:
            continue
        source = bold_bases.get(name) if same_classes else None
        glyphs.append(emph[name])
        records.append(copy.deepcopy(source or record))
    sub.BaseCoverage.glyphs = glyphs
    sub.BaseArray.BaseRecord = records
    sub.BaseArray.BaseCount = len(records)


# --- The calt feature -------------------------------------------------------


def feature_code(letters: list[str], emph: dict[str, str], digits: list[str],
                 joiners: list[str], apostrophes: list[str]) -> str:
    """OpenType feature code for word-start emphasis.

    Rules are tried in order; the first one that matches wins, and matching then
    resumes after the substituted letters. Longer words are tried first, so a
    rule that needs k letters after the word start only sees words of exactly
    the lengths that share its emphasis count.
    """
    lines = [
        f"@FitaLetter = [{' '.join(letters)}];",
        f"@FitaEmph = [{' '.join(emph[g] for g in letters)}];",
        "@FitaAnyLetter = [@FitaLetter @FitaEmph];",
        f"@FitaDigit = [{' '.join(digits)}];",
        f"@FitaJoiner = [{' '.join(joiners)}];",
        f"@FitaApostrophe = [{' '.join(apostrophes)}];",
        "@FitaWord = [@FitaLetter @FitaJoiner];",
        "",
        "lookup FitaEmphasize {",
        "  sub @FitaLetter by @FitaEmph;",
        "} FitaEmphasize;",
        "",
        "lookup FitaWordStart {",
        "  lookupflag IgnoreMarks;",
        "  # Not a word start: inside a word, or right after a digit.",
        "  ignore sub @FitaAnyLetter @FitaLetter';",
        "  ignore sub @FitaAnyLetter @FitaJoiner @FitaLetter';",
        "  ignore sub @FitaDigit @FitaLetter';",
        "  ignore sub @FitaDigit @FitaJoiner @FitaLetter';",
        "  # Words with digits stay plain (skipNumbers).",
    ]
    for i in range(MAX_WORD):
        lines.append(f"  ignore sub @FitaLetter' {'@FitaWord ' * i}@FitaDigit;")

    emphasized = "@FitaWord' lookup FitaEmphasize"
    counts = sorted({emphasis_count(k) for k in range(1, MAX_WORD + 1)}, reverse=True)

    def shortest(n: int, minimum: int = 1) -> int:
        return min(k for k in range(minimum, MAX_WORD + 1) if emphasis_count(k) == n)

    lines.append("  # Elided article + main word (l'àvia, d'una): emphasize the main word.")
    for prefix in (2, 1):
        for n in counts:
            if not any(emphasis_count(k) == n for k in range(MIN_ELISION_BODY, MAX_WORD + 1)):
                continue
            k = shortest(n, MIN_ELISION_BODY)
            rule = ["@FitaLetter'"] * prefix + ["@FitaApostrophe'"]
            rule += ["@FitaLetter' lookup FitaEmphasize"] + [emphasized] * (n - 1)
            rule += ["@FitaWord"] * (k - n)
            lines.append(f"  sub {' '.join(rule)};")

    lines.append("  # Any other word: the first letters, by word length.")
    for n in counts:
        k = shortest(n)
        rule = ["@FitaLetter' lookup FitaEmphasize"] + [emphasized] * (n - 1)
        rule += ["@FitaWord"] * (k - n)
        lines.append(f"  sub {' '.join(rule)};")
    lines += [
        "} FitaWordStart;",
        "",
        "feature calt {",
        "  lookup FitaWordStart;",
        "} calt;",
        "",
    ]
    return "\n".join(lines)


def add_calt(font: TTFont, fea: str) -> None:
    """Compiles `fea` and appends its lookups and `calt` feature to the existing
    GSUB (feaLib would otherwise replace the whole table)."""
    original = font["GSUB"]
    addOpenTypeFeaturesFromString(font, fea, tables=["GSUB"])
    built = font["GSUB"].table
    font["GSUB"] = original
    gsub = original.table

    offset = len(gsub.LookupList.Lookup)
    for lookup in built.LookupList.Lookup:
        for sub in lookup.SubTable:
            for rec in getattr(sub, "SubstLookupRecord", None) or []:
                rec.LookupListIndex += offset
            for rule_set in getattr(sub, "ChainSubRuleSet", None) or []:
                for rule in rule_set.ChainSubRule:
                    for rec in rule.SubstLookupRecord:
                        rec.LookupListIndex += offset
        gsub.LookupList.Lookup.append(lookup)
    gsub.LookupList.LookupCount = len(gsub.LookupList.Lookup)

    calt = next(r for r in built.FeatureList.FeatureRecord if r.FeatureTag == "calt")
    calt.Feature.LookupListIndex = [i + offset for i in calt.Feature.LookupListIndex]
    calt.Feature.LookupCount = len(calt.Feature.LookupListIndex)

    # Insert the feature keeping the list sorted by tag, and renumber references.
    records = gsub.FeatureList.FeatureRecord
    old = list(records)
    records.append(calt)
    records.sort(key=lambda r: r.FeatureTag)
    new_index = {id(r): i for i, r in enumerate(records)}
    remap = [new_index[id(r)] for r in old]
    calt_index = new_index[id(calt)]
    gsub.FeatureList.FeatureCount = len(records)
    for script in gsub.ScriptList.ScriptRecord:
        systems = [script.Script.DefaultLangSys] + [r.LangSys for r in script.Script.LangSysRecord]
        for lang_sys in filter(None, systems):
            indices = [remap[i] for i in lang_sys.FeatureIndex] + [calt_index]
            lang_sys.FeatureIndex = sorted(indices)
            lang_sys.FeatureCount = len(indices)


# --- Names ------------------------------------------------------------------


def set_names(font: TTFont, family: str) -> None:
    """Renames the font: the OFL forbids reusing the original name for a modified
    version (Reserved Font Names) and it avoids clashes with the installed original."""
    name = font["name"]
    source = name.getDebugName(0) or ""
    ps_family = family.replace(" ", "")
    values = {
        0: f"{source} Modifications copyright 2026 Oriol Martí Collell (https://fitaread.com).",
        1: family,
        2: "Regular",
        3: f"{FONT_VERSION};{ps_family}-Regular",
        4: f"{family} Regular",
        5: f"Version {FONT_VERSION}; based on Atkinson Hyperlegible Next 2.001",
        6: f"{ps_family}-Regular",
        10: (
            f"{family} emphasizes the start of each word as a reading aid, through "
            "contextual alternates (calt). Derived from Atkinson Hyperlegible Next."
        ),
        11: "https://fitaread.com",
    }
    for name_id in (16, 17, 21, 22, 25):
        name.removeNames(nameID=name_id)
    for name_id, value in values.items():
        name.removeNames(nameID=name_id)
        name.setName(value, name_id, 3, 1, 0x409)
    font["head"].fontRevision = float(FONT_VERSION)


# --- Main -------------------------------------------------------------------


def build(out_dir: Path) -> dict[str, Path]:
    font = TTFont(SRC_REGULAR)
    bold = TTFont(SRC_BOLD)
    if font.getGlyphOrder() != bold.getGlyphOrder():
        raise SystemExit("Regular and Bold sources must share the same glyph set.")

    letters = letter_glyphs(font)
    emph = add_emphasis_glyphs(font, bold, with_components(bold, letters))
    remove_hinting(font)
    extend_gpos(font, bold, emph)
    fea = feature_code(
        letters,
        emph,
        digit_glyphs(font),
        joiner_glyphs(font, JOINER_PREFIXES),
        joiner_glyphs(font, APOSTROPHES),
    )
    add_calt(font, fea)
    family = brand_family()
    set_names(font, family)

    out_dir.mkdir(parents=True, exist_ok=True)
    stem = f"{family.replace(' ', '')}-Regular"
    paths = {"ttf": out_dir / f"{stem}.ttf", "woff2": out_dir / f"{stem}.woff2",
             "fea": out_dir / f"{stem}.fea"}
    paths["fea"].write_text(fea, encoding="utf-8")
    font.save(paths["ttf"])
    web = TTFont(paths["ttf"])
    web.flavor = "woff2"
    web.save(paths["woff2"])
    return paths


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--out", type=Path, default=HERE / "dist", help="output directory")
    args = parser.parse_args()
    for kind, path in build(args.out).items():
        print(f"{kind:6} {path.relative_to(ROOT) if path.is_relative_to(ROOT) else path}")


if __name__ == "__main__":
    main()
