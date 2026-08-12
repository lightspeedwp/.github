#!/usr/bin/env python3
"""Validate alignment between schema assets, example assets, and schema-validation guidance."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCHEMA_TESTS = ROOT / "tests" / "schema-validation-tests.md"
SCHEMAS = ROOT / "schemas"
EXAMPLES = ROOT / "examples"
README = ROOT / "examples" / "README.md"

SCHEMA_REQUIREMENTS = {
    "schemas/site-discovery-schema.json": {
        "properties": {"environment_reviewed", "woocommerce_verification", "current_site_signals", "material_limitations", "recommended_next_step"},
        "paired_examples": {"examples/example-site-discovery.md"},
    },
    "schemas/gravity-forms-plan-schema.json": {
        "properties": {"form_purpose", "required_fields", "optional_fields", "notification_routing", "confirmation_message", "compliance_and_anti_spam", "qa_checks"},
        "paired_examples": set(),
    },
    "schemas/yoast-audit-output-schema.json": {
        "properties": {"environment_reviewed", "scope", "findings", "risks", "priority_actions"},
        "paired_examples": set(),
    },
}
PATH_RE = re.compile(r"((?:examples|schemas|tests)/[A-Za-z0-9._/-]+\.(?:md|json))")


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> int:
    failures: list[str] = []

    if not SCHEMA_TESTS.exists():
        print(f"Template/schema alignment validation failed:\n- Missing source file: {SCHEMA_TESTS.relative_to(ROOT)}")
        return 1

    schema_tests_text = SCHEMA_TESTS.read_text(encoding="utf-8")
    documented_paths = set(PATH_RE.findall(schema_tests_text))

    if "templates/" in schema_tests_text:
        failures.append("tests/schema-validation-tests.md [stale-folder-reference] templates/")

    for rel, requirement in SCHEMA_REQUIREMENTS.items():
        path = ROOT / rel
        if not path.exists():
            failures.append(f"{rel} [missing-schema]")
            continue

        try:
            data = load_json(path)
        except json.JSONDecodeError as exc:
            failures.append(f"{rel} [invalid-json] line {exc.lineno} column {exc.colno}")
            continue

        properties = set((data.get("properties") or {}).keys())
        for field in sorted(requirement["properties"] - properties):
            failures.append(f"{rel} [missing-required-property] {field}")

        if rel not in documented_paths:
            failures.append(f"tests/schema-validation-tests.md [missing-schema-reference] {rel}")

        for example_rel in sorted(requirement["paired_examples"]):
            example_path = ROOT / example_rel
            if example_path.exists() and example_rel not in documented_paths:
                failures.append(f"tests/schema-validation-tests.md [missing-example-reference] {example_rel}")
            if example_path.exists() and README.exists() and example_rel not in README.read_text(encoding="utf-8"):
                failures.append(f"examples/README.md [missing-inventory-entry] {example_rel}")

    if failures:
        print("Template/schema alignment validation failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("Template/schema alignment validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
