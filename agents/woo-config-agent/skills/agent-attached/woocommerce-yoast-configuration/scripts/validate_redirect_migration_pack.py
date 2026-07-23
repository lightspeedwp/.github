#!/usr/bin/env python3
"""Validate redirect and migration workflow files for the Yoast configuration skill."""
from pathlib import Path
import json
import sys

REQUIRED = [
    "references/redirect-migration-governance.md",
    "references/redirect-map-decision-model.md",
    "templates/redirect-map-review.md",
    "templates/migration-launch-seo-control-plan.md",
    "schemas/redirect-map-row.schema.json",
    "fixtures/sample-redirect-map-row.json",
    "tests/redirect-migration-scenario-tests.md",
]
ROUTING_REQUIRED = REQUIRED + ["scripts/validate_redirect_migration_pack.py"]
REQUIRED_TERMS = [
    "Yoast Premium redirect manager",
    "server/CDN",
    "rollback",
    "canonical",
    "sitemap",
    "launch-day",
]


def fail(payload):
    print(payload)
    return 1


def main(root="."):
    root = Path(root)
    missing = [p for p in REQUIRED if not (root / p).exists()]
    if missing:
        return fail({"missing_redirect_migration_files": missing})

    corpus = "\n".join((root / p).read_text(encoding="utf-8") for p in REQUIRED if p.endswith(".md"))
    missing_terms = [term for term in REQUIRED_TERMS if term not in corpus]
    if missing_terms:
        return fail({"missing_required_terms": missing_terms})

    schema = json.loads((root / "schemas/redirect-map-row.schema.json").read_text(encoding="utf-8"))
    fixture = json.loads((root / "fixtures/sample-redirect-map-row.json").read_text(encoding="utf-8"))
    required_fields = set(schema.get("required", []))
    missing_fixture_fields = sorted(required_fields - set(fixture))
    if missing_fixture_fields:
        return fail({"fixture_missing_required_fields": missing_fixture_fields})

    route_corpus = "\n".join([
        (root / "SKILL.md").read_text(encoding="utf-8"),
        (root / "references/file-routing-index.md").read_text(encoding="utf-8"),
        (root / "references/future-skill-architecture.md").read_text(encoding="utf-8"),
        (root / "docs/usage-guide.md").read_text(encoding="utf-8"),
        (root / "docs/maintenance-guide.md").read_text(encoding="utf-8"),
    ])
    unrouted = [p for p in ROUTING_REQUIRED if p not in route_corpus]
    if unrouted:
        return fail({"unrouted_redirect_migration_files": unrouted})

    print("redirect migration pack validation passed")
    return 0


if __name__ == "__main__":
    sys.exit(main(*(sys.argv[1:] or [])))
