#!/usr/bin/env python3
"""Validate Tour Operator content-model boundaries.

Run from the skill root or pass the skill root as the first argument.
This catches drift that the generic payload validator cannot detect.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

CORE_POST_TYPES = {"tour", "destination", "accommodation"}
EXTENSION_FACING = {"review", "special", "vehicle", "activity"}
EXTENSION_FILES = [
    "references/content-model/extensions/to-reviews.json",
    "references/content-model/extensions/to-team.json",
    "references/content-model/extensions/to-specials.json",
]


def fail(message: str) -> None:
    print(f"ERROR: {message}")
    sys.exit(1)


def load_json(root: Path, rel: str):
    path = root / rel
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        fail(f"missing file: {rel}")
    except json.JSONDecodeError as exc:
        fail(f"invalid JSON in {rel}: {exc}")


def main() -> None:
    root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd().resolve()

    post_types = load_json(root, "references/content-model/core/post-types.json")
    core_items = post_types.get("corePostTypes", [])
    slugs = {item.get("slug") for item in core_items}
    if slugs != CORE_POST_TYPES:
        fail(f"core post types must be exactly {sorted(CORE_POST_TYPES)}, found {sorted(slugs)}")

    for item in core_items:
        for key in ["slug", "label", "pluralLabel", "showInRest", "sourceFile", "sourceConfidence"]:
            if key not in item:
                fail(f"core post type {item.get('slug')} missing key: {key}")
        for field in item.get("fields", []):
            for key in ["slug", "label", "type", "visible", "sourceFile", "sourceConfidence"]:
                if key not in field:
                    fail(f"field {item.get('slug')}.{field.get('slug')} missing key: {key}")
            if field.get("slug") in {"price", "sale_price", "single_supplement"} and field.get("type") != "string":
                fail(f"pricing field {item.get('slug')}.{field.get('slug')} must remain string unless source evidence changes")

    relationships = load_json(root, "references/content-model/core/relationships.json")
    sources = relationships.get("relationshipFacetSources", [])
    source_keys = {src.get("sourceKey") for src in sources}
    for expected in [
        "cf/destination_to_accommodation",
        "cf/destination_to_tour",
        "cf/destination_to_special",
        "cf/destination_to_activity",
        "cf/destination_to_review",
        "cf/destination_to_vehicle",
    ]:
        if expected not in source_keys:
            fail(f"missing expected relationship facet source: {expected}")
    for src in sources:
        text = json.dumps(src).lower()
        if any(name in src.get("sourceKey", "") for name in EXTENSION_FACING):
            if "extension" not in src.get("ownershipBoundary", "").lower() and "unknown" not in src.get("ownershipBoundary", "").lower():
                fail(f"extension-facing source has unsafe ownership boundary: {src.get('sourceKey')}")
        if "core-owned" in text and "not proof of core-owned" not in text and any(name in text for name in EXTENSION_FACING):
            fail(f"possible unsafe core ownership claim in relationship source: {src.get('sourceKey')}")

    taxonomies = load_json(root, "references/content-model/core/taxonomies.json")
    for tax in taxonomies.get("taxonomies", []):
        for object_type in tax.get("objectTypes", []):
            if object_type in EXTENSION_FACING:
                note = tax.get("extensionBoundaryNote", "") + tax.get("sourceConfidence", "")
                if "not proof" not in note.lower() and "filterable" not in note.lower() and "extension" not in note.lower():
                    fail(f"taxonomy {tax.get('slug')} references extension-facing object type without boundary note")

    for rel in EXTENSION_FILES:
        data = load_json(root, rel)
        for post_type in data.get("postTypes", []):
            if post_type.get("slug") != "unknown":
                fail(f"{rel} must keep postTypes[].slug as unknown until extension source is bundled")
        if "conservative" not in data.get("sourceConfidence", "").lower():
            fail(f"{rel} should declare conservative placeholder source confidence")

    schema = load_json(root, "references/schema/jsonld-yoast-schema-map.json")
    for item in schema.get("contentTypes", []):
        if item.get("implementationStatus") and "not" not in str(item.get("implementationStatus")).lower() and "plan" not in str(item.get("implementationStatus")).lower():
            fail(f"schema content type {item.get('postType')} has unsafe implementationStatus")

    print("OK: content-model boundaries validated; core, extension and schema assumptions remain constrained.")


if __name__ == "__main__":
    main()
