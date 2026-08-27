#!/usr/bin/env python3
"""Validate artefact review schema, fixture, templates and routing references."""
from pathlib import Path
import json
import sys

REQUIRED = [
    "references/settings-export-review-playbook.md",
    "references/rendered-output-qa-playbook.md",
    "templates/settings-export-review.md",
    "templates/rendered-output-qa-report.md",
    "tests/artefact-review-scenario-tests.md",
    "schemas/rendered-output-check.schema.json",
    "fixtures/sample-rendered-output-check.json",
]

ROUTING_REQUIRED = [
    "references/settings-export-review-playbook.md",
    "references/rendered-output-qa-playbook.md",
    "templates/settings-export-review.md",
    "templates/rendered-output-qa-report.md",
]


def fail(payload):
    print(payload)
    return 1


def main(root="."):
    root = Path(root)
    missing = [p for p in REQUIRED if not (root / p).exists()]
    if missing:
        return fail({"missing_artefact_review_files": missing})

    for p in ["schemas/rendered-output-check.schema.json", "fixtures/sample-rendered-output-check.json"]:
        try:
            json.loads((root / p).read_text(encoding="utf-8"))
        except Exception as exc:
            return fail({"invalid_json": p, "error": str(exc)})

    corpus = "\n".join([
        (root / "SKILL.md").read_text(encoding="utf-8"),
        (root / "references/file-routing-index.md").read_text(encoding="utf-8"),
        (root / "docs/usage-guide.md").read_text(encoding="utf-8"),
    ])
    missing_routes = [p for p in ROUTING_REQUIRED if p not in corpus]
    if missing_routes:
        return fail({"artefact_review_unrouted": missing_routes})

    print("artefact review validation passed")
    return 0


if __name__ == "__main__":
    sys.exit(main(*(sys.argv[1:] or [])))
