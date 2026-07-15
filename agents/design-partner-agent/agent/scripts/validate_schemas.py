#!/usr/bin/env python3
"""Validate JSON schema files in schemas/."""

from __future__ import annotations

import json
import sys
from pathlib import Path

SCHEMA_DIR = Path("schemas")
REQUIRED_TOP_LEVEL_KEYS = ["title", "type", "properties"]

EXPECTED_SCHEMA_TITLES = {
    "design-critique.schema.json": "Design Critique Output",
    "implementation-handoff.schema.json": "Implementation Handoff Output",
    "design-brief.schema.json": "Design Brief Output",
    "design-audit.schema.json": "Design Audit Output",
    "memory-triage.schema.json": "Memory Triage Decision",
    "review-history-entry.schema.json": "Review History Entry",
}

EXPECTED_REQUIRED_FIELDS = {
    "design-critique.schema.json": ["artifact", "goal", "top_issues", "recommendations"],
    "implementation-handoff.schema.json": ["scope", "behaviors", "states", "acceptance_criteria"],
    "design-brief.schema.json": ["problem", "goals", "audience", "constraints", "open_questions"],
    "design-audit.schema.json": ["surface", "goal", "strengths", "risks", "recommendations"],
    "memory-triage.schema.json": ["destination", "reason", "confidence"],
    "review-history-entry.schema.json": ["date", "work_type", "surface_or_artifact", "goal", "key_findings", "recommendations"],
}


def validate_schema_file(path: Path) -> list[str]:
    issues: list[str] = []
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        return [f"invalid JSON: {exc}"]
    except Exception as exc:  # pragma: no cover
        return [f"could not read file: {exc}"]

    if not isinstance(data, dict):
        return ["top-level schema must be a JSON object"]

    for key in REQUIRED_TOP_LEVEL_KEYS:
        if key not in data:
            issues.append(f"missing top-level key: {key}")

    if data.get("type") != "object":
        issues.append("top-level type must be 'object'")

    if "required" not in data:
        issues.append("missing top-level required field list")
    elif not isinstance(data["required"], list):
        issues.append("top-level required must be a list")

    properties = data.get("properties")
    if properties is not None and not isinstance(properties, dict):
        issues.append("properties must be an object")

    title = data.get("title")
    if title is not None and not isinstance(title, str):
        issues.append("title must be a string")

    expected_title = EXPECTED_SCHEMA_TITLES.get(path.name)
    if expected_title and title != expected_title:
        issues.append(f"title should be '{expected_title}'")

    expected_required = EXPECTED_REQUIRED_FIELDS.get(path.name, [])
    required = data.get("required", []) if isinstance(data.get("required"), list) else []
    for field in expected_required:
        if field not in required:
            issues.append(f"missing expected required field: {field}")

    if isinstance(properties, dict):
        for field in expected_required:
            if field not in properties:
                issues.append(f"missing expected property: {field}")

    return issues


def main() -> int:
    if not SCHEMA_DIR.exists():
        print("[FAIL] schemas folder does not exist")
        return 1

    files = sorted(p for p in SCHEMA_DIR.glob("*.json") if p.is_file())
    if not files:
        print("[WARN] no schema files found")
        return 0

    failures = 0
    for path in files:
        issues = validate_schema_file(path)
        if issues:
            failures += 1
            print(f"[FAIL] {path}")
            for issue in issues:
                print(f"  - {issue}")
        else:
            print(f"[OK]   {path}")

    if failures:
        print(f"\nSchema validation failed with {failures} file(s) reporting issues.")
        return 1

    print("\nAll schema validations passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
