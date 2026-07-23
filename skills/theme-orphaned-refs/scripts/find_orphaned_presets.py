#!/usr/bin/env python3
import argparse
import json
import pathlib
import re
from difflib import get_close_matches
from typing import Dict, Iterable, List, Tuple

PRESET_TYPES = {
    "color",
    "font-family",
    "font-size",
    "spacing",
    "shadow",
    "gradient",
    "duotone",
}

NAME_TO_FONT_SIZE = {
    "tiny": "100",
    "base": "200",
    "small": "300",
    "medium": "400",
    "large": "500",
    "x-large": "600",
    "xx-large": "700",
    "xxx-large": "800",
    "gigantic": "800",
    "colossal": "900",
}

COLOR_STEP_PREFIXES = {
    "accent",
    "cta",
    "brand",
}


def load_theme_presets(theme_path: pathlib.Path) -> Dict[str, List[str]]:
    data = json.loads(theme_path.read_text(encoding="utf-8"))
    settings = data.get("settings", {})

    presets: Dict[str, List[str]] = {}
    presets["color"] = [c.get("slug") for c in settings.get("color", {}).get("palette", []) if c.get("slug")]
    presets["gradient"] = [g.get("slug") for g in settings.get("color", {}).get("gradients", []) if g.get("slug")]
    presets["duotone"] = [d.get("slug") for d in settings.get("color", {}).get("duotone", []) if d.get("slug")]
    presets["font-family"] = [f.get("slug") for f in settings.get("typography", {}).get("fontFamilies", []) if f.get("slug")]
    presets["font-size"] = [f.get("slug") for f in settings.get("typography", {}).get("fontSizes", []) if f.get("slug")]
    presets["spacing"] = [s.get("slug") for s in settings.get("spacing", {}).get("spacingSizes", []) if s.get("slug")]
    presets["shadow"] = [s.get("slug") for s in settings.get("shadow", {}).get("presets", []) if s.get("slug")]

    for key in list(presets.keys()):
        presets[key] = [s for s in presets[key] if s]

    return presets


def _numeric_slug(slug: str) -> Tuple[str, int]:
    match = re.match(r"^(.*?)-(\d+)$", slug)
    if not match:
        return "", -1
    return match.group(1), int(match.group(2))


def closest_slug(slug: str, preset_type: str, candidates: Iterable[str]) -> str:
    candidates = list(candidates)
    if not candidates:
        return slug

    if slug in candidates:
        return slug

    if preset_type == "font-size":
        mapped = NAME_TO_FONT_SIZE.get(slug)
        if mapped and mapped in candidates:
            return mapped

    prefix, number = _numeric_slug(slug)
    if number != -1:
        if prefix in COLOR_STEP_PREFIXES and number < 100:
            scaled = f"{prefix}-{number * 100}"
            if scaled in candidates:
                return scaled
        same_prefix = [c for c in candidates if c.startswith(prefix + "-")]
        if same_prefix:
            values = []
            for c in same_prefix:
                _, n = _numeric_slug(c)
                if n != -1:
                    values.append((c, n))
            if values:
                return min(values, key=lambda x: abs(x[1] - number))[0]

    close = get_close_matches(slug, candidates, n=1, cutoff=0.0)
    return close[0] if close else candidates[0]


def find_orphans(root: pathlib.Path, presets: Dict[str, List[str]]) -> List[Tuple[pathlib.Path, str, str, str]]:
    pattern_json = re.compile(r"var:preset\|([a-z-]+)\|([a-zA-Z0-9-]+)")
    pattern_css = re.compile(r"--wp--preset--([a-z-]+)--([a-zA-Z0-9-]+)")
    results = []

    for path in sorted(root.rglob("*")):
        if path.is_dir():
            continue
        if path.suffix.lower() in {".png", ".jpg", ".jpeg", ".gif", ".svg", ".woff", ".woff2", ".ttf", ".otf", ".eot"}:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except Exception:
            continue

        for pattern in (pattern_json, pattern_css):
            for match in pattern.finditer(text):
                preset_type, slug = match.group(1), match.group(2)
                if preset_type not in PRESET_TYPES:
                    continue
                candidates = presets.get(preset_type, [])
                if slug not in candidates:
                    suggestion = closest_slug(slug, preset_type, candidates)
                    results.append((path, preset_type, slug, suggestion))

    return results


def main() -> int:
    parser = argparse.ArgumentParser(description="Find orphaned theme preset references and suggest replacements.")
    parser.add_argument("--root", default=".", help="Theme root directory.")
    parser.add_argument("--theme", default="theme.json", help="Path to theme.json relative to root.")
    parser.add_argument("--report", default="_orphaned_preset_refs.txt", help="Report filename.")
    args = parser.parse_args()

    root = pathlib.Path(args.root).resolve()
    theme_path = (root / args.theme).resolve()

    presets = load_theme_presets(theme_path)
    orphans = find_orphans(root, presets)

    report_path = root / args.report
    with report_path.open("w", encoding="utf-8") as f:
        for path, preset_type, slug, suggestion in orphans:
            f.write(f"{path}\t{preset_type}\t{slug}\t{suggestion}\n")

    print(f"Orphaned count: {len(orphans)}")
    print(f"Report: {report_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
