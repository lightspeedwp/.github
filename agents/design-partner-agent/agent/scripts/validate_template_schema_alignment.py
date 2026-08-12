#!/usr/bin/env python3
"""Validate tighter alignment between workflow templates and schemas."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(".")

WORKFLOWS = {
    "design-critique": {
        "template": ROOT / "templates/design-critique-template.md",
        "schema": ROOT / "schemas/design-critique.schema.json",
        "heading_field_pairs": {
            "artifact": "artifact",
            "goal": "goal",
            "top issues": "top_issues",
            "recommendations": "recommendations",
            "accessibility notes": "accessibility_notes",
            "open questions": "open_questions",
        },
    },
    "implementation-handoff": {
        "template": ROOT / "templates/implementation-handoff-template.md",
        "schema": ROOT / "schemas/implementation-handoff.schema.json",
        "heading_field_pairs": {
            "scope": "scope",
            "behaviors": "behaviors",
            "states": "states",
            "dependencies": "dependencies",
            "edge cases": "edge_cases",
            "acceptance criteria": "acceptance_criteria",
            "open questions": "open_questions",
        },
    },
    "design-brief": {
        "template": ROOT / "templates/design-brief-template.md",
        "schema": ROOT / "schemas/design-brief.schema.json",
        "heading_field_pairs": {
            "goals": "goals",
            "constraints": "constraints",
            "open questions": "open_questions",
        },
    },
    "reference-site-analysis": {
        "template": ROOT / "templates/reference-site-analysis-template.md",
        "schema": ROOT / "schemas/reference-site-analysis.schema.json",
        "heading_field_pairs": {
            "urls analyzed": "urls_analyzed",
            "directly verified observations": "directly_verified_observations",
            "open questions": "open_questions",
        },
    },
}


def extract_headings(text: str) -> set[str]:
    headings: set[str] = set()
    for line in text.splitlines():
        if line.startswith("#"):
            headings.add(re.sub(r"^#+\s*", "", line).strip().lower())
    return headings


def main() -> int:
    issues: list[str] = []
    for workflow, config in WORKFLOWS.items():
        template = config["template"]
        schema = config["schema"]
        if not template.exists():
            issues.append(f"missing template for {workflow}: {template}")
            continue
        if not schema.exists():
            issues.append(f"missing schema for {workflow}: {schema}")
            continue

        template_headings = extract_headings(template.read_text(encoding="utf-8"))
        try:
            schema_data = json.loads(schema.read_text(encoding="utf-8"))
        except Exception as exc:
            issues.append(f"{schema} could not be parsed: {exc}")
            continue

        properties = schema_data.get("properties", {}) if isinstance(schema_data, dict) else {}
        for heading, field in config["heading_field_pairs"].items():
            if heading not in template_headings:
                issues.append(f"{template} missing heading '{heading}'")
            if field not in properties:
                issues.append(f"{schema} missing property '{field}'")

    if issues:
        for issue in issues:
            print(f"[FAIL] {issue}")
        print(f"\nTemplate/schema alignment validation failed with {len(issues)} issue(s).")
        return 1

    print("Template/schema alignment validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
