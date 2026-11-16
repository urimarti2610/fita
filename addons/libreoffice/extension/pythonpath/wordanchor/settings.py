"""Strength and style, saved as a small JSON file in the LibreOffice user profile."""

from __future__ import annotations

import json
import os
from dataclasses import asdict, dataclass

from .emphasis import resolve_options
from .writer import STYLES

STRENGTHS = {"lighter": 0.3, "medium": 0.45, "stronger": 0.6}


@dataclass
class Settings:
    strength: float = STRENGTHS["medium"]
    style: str = "bold"


def parse(raw) -> Settings:
    value = raw if isinstance(raw, dict) else {}
    style = value.get("style")
    return Settings(
        strength=resolve_options(strength=value.get("strength")).strength,
        style=style if style in STYLES else "bold",
    )


def load(path: str) -> Settings:
    try:
        with open(path, encoding="utf-8") as f:
            return parse(json.load(f))
    except (OSError, ValueError):
        return Settings()


def save(path: str, settings: Settings) -> None:
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(asdict(settings), f)
