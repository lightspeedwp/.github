#!/usr/bin/env python3
"""Validate files in templates, examples, schemas, and memory.

This script checks the current folder contents against the schema-validation
rules added to the agent. It uses the JSON files in `schemas/` for the shared
shape rules and adds file-specific heading checks for the current project
artifacts.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parent.parent
SCHEMAS_DIR = ROOT / "schemas"


def load_json(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def headings(text: str) -> list[str]:
    return [line.strip() for line in text.splitlines() if line.startswith("## ")]


def first_nonempty_line(text: str) -> str:
    for line in text.splitlines():
        if line.strip():
            return line.strip()
    return ""


def find_missing_sections(found: Iterable[str], required: Iterable[str]) -> list[str]:
    found_set = set(found)
    return [section for section in required if section not in found_set]


def load_rules() -> dict:
    return {
        "template": load_json(SCHEMAS_DIR / "template-file-validation-schema.json"),
        "example": load_json(SCHEMAS_DIR / "example-file-validation-schema.json"),
        "schema": load_json(SCHEMAS_DIR / "schema-file-validation-schema.json"),
        "memory": load_json(SCHEMAS_DIR / "memory-file-validation-schema.json"),
    }


def regex_from_rule(rule: dict, field: str) -> re.Pattern[str]:
    pattern = rule["properties"][field]["pattern"]
    return re.compile(pattern)


def validate_templates(root: Path, rules: dict) -> list[str]:
    errors: list[str] = []
    folder = root / "templates"
    filename_re = regex_from_rule(rules["template"], "filename")
    title_re = regex_from_rule(rules["template"], "title")

    expected_sections = {
        "pre-launch-summary-template.md": [
            "## Completed",
            "## Missing",
            "## Risks",
            "## Recommended next actions",
        ],
        "site-discovery-template.md": [
            "## Business basics",
            "## Site structure",
            "## Content model",
            "## Forms and SEO",
        ],
        "gravity-forms-plan-template.md": [
            "## Form purpose",
            "## Required fields",
            "## Optional fields",
            "## Notification routing",
            "## Confirmation message",
            "## Compliance and anti-spam",
            "## QA checks",
        ],
    }

    for path in sorted(folder.glob("*.md")):
        if path.name == "README.md":
            continue
        text = read_text(path)
        if not filename_re.match(path.name):
            errors.append(f"templates/{path.name}: filename must end with -template.md")
        if not title_re.match(first_nonempty_line(text)):
            errors.append(f"templates/{path.name}: first non-empty line must be a level-1 title")
        required = expected_sections.get(path.name)
        if not required:
            errors.append(f"templates/{path.name}: no validator section profile is defined yet")
            continue
        missing = find_missing_sections(headings(text), required)
        if missing:
            errors.append(
                f"templates/{path.name}: missing sections: {', '.join(missing)}"
            )

    return errors


def validate_examples(root: Path, rules: dict) -> list[str]:
    errors: list[str] = []
    folder = root / "examples"
    filename_re = regex_from_rule(rules["example"], "filename")
    title_re = regex_from_rule(rules["example"], "title")

    expected_sections = {
        "example-pre-launch-summary.md": [
            "## Completed",
            "## Missing",
            "## Risks",
            "## Next actions",
        ],
        "example-site-discovery.md": [
            "## Business basics",
            "## Site structure",
            "## Content model",
            "## Forms and SEO",
        ],
    }

    for path in sorted(folder.glob("*.md")):
        if path.name == "README.md":
            continue
        text = read_text(path)
        if not filename_re.match(path.name):
            errors.append(f"examples/{path.name}: filename must start with example-")
        if not title_re.match(first_nonempty_line(text)):
            errors.append(f"examples/{path.name}: first non-empty line must start with '# Example '")
        required = expected_sections.get(path.name)
        if not required:
            errors.append(f"examples/{path.name}: no validator section profile is defined yet")
            continue
        missing = find_missing_sections(headings(text), required)
        if missing:
            errors.append(
                f"examples/{path.name}: missing sections: {', '.join(missing)}"
            )
        populated_lines = [
            line.strip()
            for line in text.splitlines()
            if line.strip().startswith(("- ", "1. ", "2. ", "3. "))
            and line.strip() not in {"-", "1.", "2.", "3."}
        ]
        if not populated_lines:
            errors.append(f"examples/{path.name}: example file must contain filled example content")

    return errors


def validate_schema_files(root: Path, rules: dict) -> list[str]:
    errors: list[str] = []
    folder = root / "schemas"
    filename_re = regex_from_rule(rules["schema"], "filename")

    for path in sorted(folder.glob("*.json")):
        try:
            data = load_json(path)
        except Exception as exc:  # pragma: no cover - direct failure path
            errors.append(f"schemas/{path.name}: invalid JSON ({exc})")
            continue

        if not filename_re.match(path.name):
            errors.append(f"schemas/{path.name}: filename must end with -schema.json")
        title = data.get("title")
        if not isinstance(title, str) or not title.strip():
            errors.append(f"schemas/{path.name}: schema must have a non-empty title")
        if data.get("type") != "object":
            errors.append(f"schemas/{path.name}: root type must be 'object'")
        properties = data.get("properties")
        if not isinstance(properties, dict) or not properties:
            errors.append(f"schemas/{path.name}: schema must define non-empty properties")

    return errors


def validate_memory(root: Path, rules: dict) -> list[str]:
    errors: list[str] = []
    folder = root / "memory"
    filename_re = regex_from_rule(rules["memory"], "filename")
    title_re = regex_from_rule(rules["memory"], "title")

    expected_sections = {
        "todos.md": [
            "## Active",
            "## Blocked",
            "## Follow-ups",
            "## Pending decisions",
            "## Done",
            "## Notes",
        ],
        "user-preferences.md": [
            "## Client overview",
            "## Site defaults",
            "## Form standards",
            "## SEO priorities",
            "## QA and compliance",
            "## Notes",
        ],
        "project-history.md": [
            "## Suggested entries",
        ],
        "session-handoff.md": [
            "## Suggested structure",
        ],
    }

    for path in sorted(folder.glob("*.md")):
        if path.name == "README.md":
            continue
        text = read_text(path)
        if not filename_re.match(path.name):
            errors.append(f"memory/{path.name}: filename must be lowercase markdown")
        if not title_re.match(first_nonempty_line(text)):
            errors.append(f"memory/{path.name}: first non-empty line must be a level-1 title")
        required = expected_sections.get(path.name)
        if not required:
            errors.append(f"memory/{path.name}: no validator section profile is defined yet")
            continue
        missing = find_missing_sections(headings(text), required)
        if missing:
            errors.append(f"memory/{path.name}: missing sections: {', '.join(missing)}")

    return errors


def main() -> int:
    root = ROOT
    rules = load_rules()
    errors: list[str] = []
    errors.extend(validate_templates(root, rules))
    errors.extend(validate_examples(root, rules))
    errors.extend(validate_schema_files(root, rules))
    errors.extend(validate_memory(root, rules))

    if errors:
        print("Validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print("Validation passed for templates, examples, schemas, and memory.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
