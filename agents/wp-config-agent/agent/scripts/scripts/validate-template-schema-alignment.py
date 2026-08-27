#!/usr/bin/env python3
"""Validate template, example, and schema alignment for the current WordPress agent structure."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HEADING_RE = re.compile(r"^##\s+(.+?)\s*$", re.MULTILINE)

ALIGNMENT_RULES = [
    {
        "name": "site-discovery",
        "template": "templates/site-discovery-template.md",
        "example": "examples/example-site-discovery.md",
        "schema": "schemas/site-discovery-schema.json",
        "required_headings": [
            "Structural Blueprint Table",
            "Machine Readability Report",
            "Next Actions",
        ],
        "schema_field_aliases": {
            "site_name": ["site name"],
            "primary_goal": ["primary goal", "goal"],
            "page_structure": ["page structure", "structural blueprint"],
            "forms": ["forms"],
            "seo_priorities": ["seo priorities", "seo"],
        },
    },
    {
        "name": "pre-launch-summary",
        "template": "templates/pre-launch-summary-template.md",
        "example": "examples/example-pre-launch-summary.md",
        "schema": None,
        "required_headings": [
            "Confirmed Items",
            "Missing or Unverified Items",
            "Risks",
            "Blockers",
            "Recommended Next Actions",
            "Manual Checks Before Go-Live",
        ],
        "schema_field_aliases": {},
    },
    {
        "name": "gravity-forms-plan",
        "template": "templates/gravity-forms-plan-template.md",
        "example": None,
        "schema": "schemas/enquiry-form-schema.json",
        "required_headings": [
            "Form Overview",
            "Fields",
            "Routing and Notifications",
            "Spam Protection and Consent",
            "QA Checks",
        ],
        "schema_field_aliases": {
            "form_name": ["form name", "form overview"],
            "fields": ["fields"],
            "notifications": ["notifications", "routing"],
            "consent_requirements": ["consent", "privacy"],
        },
    },
]


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def headings(text: str) -> list[str]:
    return [match.group(1).strip() for match in HEADING_RE.finditer(text)]


def load_schema_properties(path: Path) -> set[str]:
    data = json.loads(read(path))
    properties = data.get("properties", {})
    if isinstance(properties, dict):
        return set(properties.keys())
    return set()


def covers_aliases(text: str, aliases: list[str]) -> bool:
    lowered = text.lower()
    return any(alias.lower() in lowered for alias in aliases)


def main() -> int:
    failures: list[str] = []

    for rule in ALIGNMENT_RULES:
        name = rule["name"]
        template_path = ROOT / rule["template"]
        if not template_path.exists():
            failures.append(f"[{name}] missing template: {rule['template']}")
            continue

        template_text = read(template_path)
        template_headings = headings(template_text)

        for heading in rule["required_headings"]:
            if heading not in template_headings:
                failures.append(f"[{name}] template missing required heading: {heading}")

        example_rel = rule["example"]
        example_text = ""
        if example_rel:
            example_path = ROOT / example_rel
            if not example_path.exists():
                failures.append(f"[{name}] missing example: {example_rel}")
            else:
                example_text = read(example_path)
                example_headings = headings(example_text)
                for heading in rule["required_headings"]:
                    if heading not in example_headings:
                        failures.append(f"[{name}] example missing required heading: {heading}")

        schema_rel = rule["schema"]
        if schema_rel:
            schema_path = ROOT / schema_rel
            if not schema_path.exists():
                failures.append(f"[{name}] missing schema: {schema_rel}")
            else:
                schema_fields = load_schema_properties(schema_path)
                alias_map = rule["schema_field_aliases"]
                searchable_text = "\n".join(filter(None, [template_text, example_text]))

                for field, aliases in alias_map.items():
                    if field not in schema_fields:
                        failures.append(f"[{name}] schema missing expected top-level field: {field}")
                    if not covers_aliases(searchable_text, aliases):
                        failures.append(
                            f"[{name}] template/example coverage missing for schema field '{field}'"
                        )

    if failures:
        print("Template/schema alignment validation failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("Template/schema alignment validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
