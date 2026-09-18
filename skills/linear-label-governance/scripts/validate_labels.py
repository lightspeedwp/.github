#!/usr/bin/env python3
"""Validate a LightSpeed issue or PR label set against governance rules."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


LABEL_RE = re.compile(r"^[a-z0-9][a-z0-9-]*:[a-z0-9][a-z0-9-]*$")
NAME_RE = re.compile(r"^\s*-\s+name:\s*[\"']?([^\"'#\s]+)[\"']?\s*(?:#.*)?$")
ONE_HOT_FAMILIES = ("type", "status", "priority")
CHANGELOG_LABELS = {"meta:needs-changelog", "meta:no-changelog"}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Validate LightSpeed family-prefixed labels."
    )
    parser.add_argument(
        "--labels",
        nargs="+",
        required=True,
        help="Labels separated by spaces or commas; quote labels containing spaces to expose errors.",
    )
    parser.add_argument("--entity", choices=("issue", "pr"), default="issue")
    parser.add_argument(
        "--user-facing-change",
        choices=("yes", "no", "unknown"),
        default="unknown",
        help="For PRs, whether exactly one release:* label is required.",
    )
    parser.add_argument(
        "--canonical-file",
        type=Path,
        help="Path to the current LightSpeed .github/labels.yml.",
    )
    parser.add_argument("--json", action="store_true", dest="as_json")
    return parser.parse_args()


def normalize_inputs(values: list[str]) -> list[str]:
    labels: list[str] = []
    for value in values:
        labels.extend(part.strip() for part in value.split(",") if part.strip())
    return labels


def load_canonical(path: Path) -> set[str]:
    if not path.is_file():
        raise FileNotFoundError(f"canonical file not found: {path}")
    labels: set[str] = set()
    for line in path.read_text(encoding="utf-8").splitlines():
        match = NAME_RE.match(line)
        if match:
            labels.add(match.group(1))
    if not labels:
        raise ValueError(f"no label names found in canonical file: {path}")
    return labels


def validate(args: argparse.Namespace) -> dict[str, object]:
    labels = normalize_inputs(args.labels)
    errors: list[str] = []
    warnings: list[str] = []

    if len(labels) != len(set(labels)):
        errors.append("duplicate labels are not allowed")

    for label in labels:
        if not LABEL_RE.fullmatch(label):
            errors.append(
                f"{label!r} is not an exact lower-case family:value label"
            )

    canonical: set[str] | None = None
    if args.canonical_file:
        try:
            canonical = load_canonical(args.canonical_file)
        except (FileNotFoundError, ValueError) as exc:
            errors.append(str(exc))
        if canonical:
            for label in labels:
                if label not in canonical:
                    errors.append(f"{label!r} is not in the canonical label file")
    else:
        warnings.append(
            "canonical membership was not checked; provide --canonical-file"
        )

    family_map: dict[str, list[str]] = {}
    for label in labels:
        if ":" in label:
            family = label.split(":", 1)[0]
            family_map.setdefault(family, []).append(label)

    for family in ONE_HOT_FAMILIES:
        count = len(family_map.get(family, []))
        if count != 1:
            errors.append(f"expected exactly one {family}:* label; found {count}")

    area_count = len(family_map.get("area", [])) + len(family_map.get("comp", []))
    if area_count < 1:
        errors.append("expected at least one area:* or comp:* label")

    if args.entity == "pr":
        changelog_count = len(CHANGELOG_LABELS.intersection(labels))
        if changelog_count != 1:
            errors.append(
                "expected exactly one of meta:needs-changelog and meta:no-changelog"
            )
        release_count = len(family_map.get("release", []))
        if args.user_facing_change == "yes" and release_count != 1:
            errors.append(
                f"user-facing PR requires exactly one release:* label; found {release_count}"
            )
        elif args.user_facing_change == "unknown":
            warnings.append("release requirement was not resolved for this PR")

    return {
        "valid": not errors,
        "entity": args.entity,
        "labels": labels,
        "canonical_checked": canonical is not None,
        "errors": errors,
        "warnings": warnings,
    }


def main() -> int:
    args = parse_args()
    result = validate(args)
    if args.as_json:
        print(json.dumps(result, indent=2, sort_keys=True))
    else:
        print("PASS" if result["valid"] else "FAIL")
        for message in result["errors"]:
            print(f"ERROR: {message}")
        for message in result["warnings"]:
            print(f"WARNING: {message}")
    return 0 if result["valid"] else 1


if __name__ == "__main__":
    sys.exit(main())
