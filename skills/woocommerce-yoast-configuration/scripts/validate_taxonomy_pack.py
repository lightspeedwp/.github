#!/usr/bin/env python3
"""Validate content-structure and taxonomy decision workflow files."""
from pathlib import Path
import json
import sys

REQUIRED = [
    "references/content-structure-taxonomy-playbook.md",
    "references/taxonomy-indexation-decision-model.md",
    "templates/taxonomy-indexation-decision-pack.md",
    "templates/content-structure-remediation-plan.md",
    "schemas/taxonomy-decision.schema.json",
    "fixtures/sample-taxonomy-decision.json",
    "tests/content-taxonomy-scenario-tests.md",
]
ROUTE_FILES = ["SKILL.md", "references/file-routing-index.md", "references/future-skill-architecture.md"]
TOKENS = [
    "references/content-structure-taxonomy-playbook.md",
    "references/taxonomy-indexation-decision-model.md",
    "templates/taxonomy-indexation-decision-pack.md",
    "templates/content-structure-remediation-plan.md",
]

def main(root="."):
    root = Path(root)
    missing = [p for p in REQUIRED if not (root / p).exists()]
    if missing:
        print({"missing_taxonomy_files": missing})
        return 1
    try:
        schema = json.loads((root / "schemas/taxonomy-decision.schema.json").read_text(encoding="utf-8"))
        fixture = json.loads((root / "fixtures/sample-taxonomy-decision.json").read_text(encoding="utf-8"))
    except Exception as exc:
        print({"json_error": str(exc)})
        return 1
    missing_required = [k for k in schema.get("required", []) if k not in fixture]
    if missing_required:
        print({"fixture_missing_required": missing_required})
        return 1
    enums = schema.get("properties", {})
    enum_errors = {}
    for key, value in fixture.items():
        allowed = enums.get(key, {}).get("enum")
        if allowed and value not in allowed:
            enum_errors[key] = value
    if enum_errors:
        print({"fixture_enum_errors": enum_errors})
        return 1
    corpus = "\n".join((root / p).read_text(encoding="utf-8") for p in ROUTE_FILES if (root / p).exists())
    missing_routes = [t for t in TOKENS if t not in corpus]
    if missing_routes:
        print({"taxonomy_routes_missing": missing_routes})
        return 1
    print("taxonomy pack validation passed")
    return 0

if __name__ == "__main__":
    sys.exit(main(*(sys.argv[1:] or [])))
