#!/usr/bin/env python3
"""Check consistency across templates, examples, and schemas.

This validator checks the current draft's actual workflow shapes instead of
forcing every example to mirror template headings exactly.
"""

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
        "examples": [
            (ROOT / "examples/design-critique-example.md", ["goal", "top issues", "recommendations"]),
            (ROOT / "examples/woo-product-page-critique-example.md", ["top issues", "recommendations"]),
        ],
        "template_required_headings": ["artifact", "goal", "recommendations"],
        "required_schema_fields": ["artifact", "goal", "recommendations"],
    },
    "implementation-handoff": {
        "template": ROOT / "templates/implementation-handoff-template.md",
        "schema": ROOT / "schemas/implementation-handoff.schema.json",
        "examples": [
            (ROOT / "examples/implementation-handoff-example.md", ["scope", "behaviors", "acceptance criteria"]),
        ],
        "template_required_headings": ["scope", "behaviors", "acceptance criteria"],
        "required_schema_fields": ["scope", "behaviors", "acceptance_criteria"],
    },
    "research-synthesis": {
        "template": ROOT / "templates/research-synthesis-template.md",
        "schema": ROOT / "schemas/research-synthesis.schema.json",
        "examples": [
            (ROOT / "examples/research-synthesis-example.md", ["inputs", "core findings", "design implications"]),
        ],
        "template_required_headings": ["inputs reviewed", "core findings", "design implications"],
        "required_schema_fields": ["inputs_reviewed", "core_findings", "design_implications"],
    },
    "ux-writing": {
        "template": ROOT / "templates/ux-writing-template.md",
        "schema": ROOT / "schemas/ux-writing.schema.json",
        "examples": [
            (ROOT / "examples/ux-writing-example.md", ["surface or moment", "current copy", "recommended copy options"]),
        ],
        "template_required_headings": ["surface or moment", "current copy", "recommended copy options"],
        "required_schema_fields": ["surface_or_moment", "current_copy", "recommended_copy_options"],
    },
    "design-brief": {
        "template": ROOT / "templates/client-review-brief-template.md",
        "schema": ROOT / "schemas/design-brief.schema.json",
        "examples": [
            (ROOT / "examples/design-brief-example.md", ["problem", "goals", "open questions"]),
        ],
        "template_required_headings": ["client or project", "goal of the review", "questions to answer"],
        "required_schema_fields": ["problem", "goals", "open_questions"],
    },
    "design-audit": {
        "template": None,
        "schema": ROOT / "schemas/design-audit.schema.json",
        "examples": [
            (ROOT / "examples/tour-booking-audit-example.md", ["key findings", "improvement opportunities"]),
            (ROOT / "examples/publishing-homepage-audit-example.md", ["goal", "key findings", "recommendations"]),
        ],
        "template_required_headings": [],
        "required_schema_fields": ["surface", "goal", "recommendations"],
    },
    "reference-site-analysis": {
        "template": ROOT / "templates/reference-site-analysis-template.md",
        "schema": ROOT / "schemas/reference-site-analysis.schema.json",
        "examples": [
            (ROOT / "examples/reference-site-analysis-example.md", ["urls analyzed", "directly verified observations", "open questions"]),
        ],
        "template_required_headings": ["urls analyzed", "directly verified observations", "open questions"],
        "required_schema_fields": ["urls_analyzed", "directly_verified_observations", "open_questions"],
    },
}


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def extract_headings(text: str) -> set[str]:
    headings: set[str] = set()
    for line in text.splitlines():
        if line.startswith("#"):
            headings.add(re.sub(r"^#+\s*", "", line).strip().lower())
    return headings


def check_file_exists(path: Path | None, label: str, issues: list[str]) -> None:
    if path and not path.exists():
        issues.append(f"missing {label}: {path}")


def main() -> int:
    issues: list[str] = []

    for workflow, config in WORKFLOWS.items():
        template = config["template"]
        schema = config["schema"]
        examples = config["examples"]

        check_file_exists(template, f"template for {workflow}", issues)
        check_file_exists(schema, f"schema for {workflow}", issues)
        for example_path, _ in examples:
            check_file_exists(example_path, f"example for {workflow}", issues)

        if template and template.exists():
            template_headings = extract_headings(read_text(template))
            for heading in config["template_required_headings"]:
                if heading not in template_headings:
                    issues.append(f"{template} missing heading '{heading}'")

        for example_path, expected_headings in examples:
            if example_path.exists():
                example_headings = extract_headings(read_text(example_path))
                for heading in expected_headings:
                    if heading not in example_headings:
                        issues.append(f"{example_path} missing heading '{heading}'")

        if schema and schema.exists():
            try:
                data = json.loads(read_text(schema))
            except Exception as exc:
                issues.append(f"{schema} could not be parsed: {exc}")
                continue
            properties = data.get("properties", {}) if isinstance(data, dict) else {}
            for field in config["required_schema_fields"]:
                if field not in properties:
                    issues.append(f"{schema} missing property '{field}' for {workflow}")

    if issues:
        for issue in issues:
            print(f"[FAIL] {issue}")
        print(f"\nCross-file consistency validation failed with {len(issues)} issue(s).")
        return 1

    print("All cross-file consistency checks passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
