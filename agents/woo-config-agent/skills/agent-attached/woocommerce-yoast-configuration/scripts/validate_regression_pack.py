#!/usr/bin/env python3
"""Validate Yoast comparison/regression pack files and fixture."""
from pathlib import Path
import json
import sys

REQUIRED = [
    "references/state-comparison-playbook.md",
    "references/plugin-update-regression-playbook.md",
    "templates/yoast-state-comparison-report.md",
    "templates/yoast-regression-test-report.md",
    "templates/yoast-acceptance-criteria.md",
    "schemas/regression-check.schema.json",
    "fixtures/sample-regression-check.json",
    "tests/comparison-regression-scenario-tests.md",
]

def main(root="."):
    root = Path(root)
    missing = [p for p in REQUIRED if not (root / p).exists()]
    if missing:
        print({"missing_regression_pack_files": missing})
        return 1
    schema = json.loads((root / "schemas/regression-check.schema.json").read_text(encoding="utf-8"))
    fixture = json.loads((root / "fixtures/sample-regression-check.json").read_text(encoding="utf-8"))
    for key in schema.get("required", []):
        if key not in fixture:
            print({"fixture_missing_required_key": key})
            return 1
    statuses = {"pass", "pass_with_notes", "blocked", "failed", "needs_verification"}
    if fixture.get("overall_status") not in statuses:
        print({"invalid_overall_status": fixture.get("overall_status")})
        return 1
    check_statuses = {"pass", "fail", "not_applicable", "needs_verification"}
    for item in fixture.get("checks", []):
        if item.get("status") not in check_statuses:
            print({"invalid_check_status": item})
            return 1
    corpus = "\n".join([
        (root / "SKILL.md").read_text(encoding="utf-8"),
        (root / "references/file-routing-index.md").read_text(encoding="utf-8"),
        (root / "references/future-skill-architecture.md").read_text(encoding="utf-8"),
    ])
    for path in REQUIRED:
        if path not in corpus:
            print({"regression_file_not_routed": path})
            return 1
    print("regression pack validation passed")
    return 0

if __name__ == "__main__":
    sys.exit(main(*(sys.argv[1:] or [])))
