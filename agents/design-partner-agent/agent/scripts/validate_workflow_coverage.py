#!/usr/bin/env python3
"""Report workflow coverage across templates, examples, schemas, and tests.

This validator distinguishes required assets from optional ones so the package can
report real gaps without flagging intentional omissions as failures.
"""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(".")

WORKFLOWS = {
    "design-critique": {"template": {"path": ROOT / "templates/design-critique-template.md", "required": True}, "examples": {"paths": [ROOT / "examples/design-critique-example.md", ROOT / "examples/woo-product-page-critique-example.md"], "required_min": 1}, "schema": {"path": ROOT / "schemas/design-critique.schema.json", "required": True}, "tests": {"paths": [ROOT / "tests/schema-validation-tests.md"], "required_min": 0}},
    "design-audit": {"template": {"path": None, "required": False}, "examples": {"paths": [ROOT / "examples/tour-booking-audit-example.md", ROOT / "examples/publishing-homepage-audit-example.md"], "required_min": 1}, "schema": {"path": ROOT / "schemas/design-audit.schema.json", "required": True}, "tests": {"paths": [ROOT / "tests/schema-validation-tests.md", ROOT / "tests/accessibility-review-quality-check.md"], "required_min": 0}},
    "design-brief": {"template": {"path": ROOT / "templates/client-review-brief-template.md", "required": True}, "examples": {"paths": [ROOT / "examples/design-brief-example.md"], "required_min": 1}, "schema": {"path": ROOT / "schemas/design-brief.schema.json", "required": True}, "tests": {"paths": [ROOT / "tests/schema-validation-tests.md"], "required_min": 0}},
    "research-synthesis": {"template": {"path": ROOT / "templates/research-synthesis-template.md", "required": True}, "examples": {"paths": [ROOT / "examples/research-synthesis-example.md"], "required_min": 1}, "schema": {"path": ROOT / "schemas/research-synthesis.schema.json", "required": True}, "tests": {"paths": [ROOT / "tests/schema-validation-tests.md"], "required_min": 0}},
    "reference-site-analysis": {"template": {"path": ROOT / "templates/reference-site-analysis-template.md", "required": True}, "examples": {"paths": [ROOT / "examples/reference-site-analysis-example.md"], "required_min": 1}, "schema": {"path": ROOT / "schemas/reference-site-analysis.schema.json", "required": True}, "tests": {"paths": [ROOT / "tests/schema-validation-tests.md", ROOT / "tests/reference-site-analysis-quality-check.md"], "required_min": 0}},
    "ux-writing": {"template": {"path": ROOT / "templates/ux-writing-template.md", "required": True}, "examples": {"paths": [ROOT / "examples/ux-writing-example.md"], "required_min": 1}, "schema": {"path": ROOT / "schemas/ux-writing.schema.json", "required": True}, "tests": {"paths": [ROOT / "tests/brand-voice-quality-check.md", ROOT / "tests/schema-validation-tests.md"], "required_min": 0}},
    "implementation-handoff": {"template": {"path": ROOT / "templates/implementation-handoff-template.md", "required": True}, "examples": {"paths": [ROOT / "examples/implementation-handoff-example.md"], "required_min": 1}, "schema": {"path": ROOT / "schemas/implementation-handoff.schema.json", "required": True}, "tests": {"paths": [ROOT / "tests/schema-validation-tests.md"], "required_min": 0}},
}


def count_existing(paths: list[Path]) -> tuple[int, list[Path]]:
    existing = [path for path in paths if path.exists()]
    return len(existing), existing


def main() -> int:
    failures: list[str] = []
    warnings: list[str] = []
    for workflow, assets in WORKFLOWS.items():
        template = assets["template"]
        template_path = template["path"]
        if template_path is not None and not template_path.exists():
            target = failures if template["required"] else warnings
            target.append(f"{workflow}: missing template {template_path}")
        schema = assets["schema"]
        schema_path = schema["path"]
        if schema_path is not None and not schema_path.exists():
            target = failures if schema["required"] else warnings
            target.append(f"{workflow}: missing schema {schema_path}")
        example_count, _ = count_existing(assets["examples"]["paths"])
        if example_count < assets["examples"]["required_min"]:
            failures.append(f"{workflow}: requires at least {assets['examples']['required_min']} example file(s), found {example_count}")
        test_count, existing_tests = count_existing(assets["tests"]["paths"])
        if test_count < assets["tests"]["required_min"]:
            failures.append(f"{workflow}: requires at least {assets['tests']['required_min']} test file(s), found {test_count}")
        elif test_count < len(assets["tests"]["paths"]):
            missing = [path for path in assets["tests"]["paths"] if path not in existing_tests]
            for path in missing:
                warnings.append(f"{workflow}: optional test not found {path}")
    for item in warnings:
        print(f"[WARN] {item}")
    if failures:
        for item in failures:
            print(f"[FAIL] {item}")
        print(f"\nWorkflow coverage check failed with {len(failures)} required gap(s).")
        return 1
    print("All required workflow coverage checks passed.")
    if warnings:
        print(f"Workflow coverage reported {len(warnings)} warning(s).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
