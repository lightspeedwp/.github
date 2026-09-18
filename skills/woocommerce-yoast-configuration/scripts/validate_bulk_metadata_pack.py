#!/usr/bin/env python3
"""Validate bulk metadata governance files, schema, fixture, and routing coverage."""
from pathlib import Path
import json
import sys

REQUIRED = [
    "references/bulk-metadata-governance.md",
    "references/approval-queue-workflow.md",
    "templates/metadata-bulk-edit-plan.md",
    "templates/yoast-approval-queue.md",
    "schemas/bulk-metadata-change.schema.json",
    "fixtures/sample-bulk-metadata-change.json",
    "tests/bulk-metadata-governance-scenario-tests.md",
]
ROUTE_TERMS = [
    "references/bulk-metadata-governance.md",
    "references/approval-queue-workflow.md",
    "templates/metadata-bulk-edit-plan.md",
    "templates/yoast-approval-queue.md",
    "scripts/validate_bulk_metadata_pack.py",
]
VALID_STATUSES = {"candidate", "needs_source", "needs_rewrite", "needs_approval", "approved_for_staging", "implemented_unverified", "verified_live", "rejected"}


def fail(payload):
    print(payload)
    return 1


def main(root="."):
    root = Path(root)
    missing = [p for p in REQUIRED if not (root / p).exists()]
    if missing:
        return fail({"missing_bulk_metadata_files": missing})

    schema = json.loads((root / "schemas/bulk-metadata-change.schema.json").read_text(encoding="utf-8"))
    fixture = json.loads((root / "fixtures/sample-bulk-metadata-change.json").read_text(encoding="utf-8"))
    required = set(schema.get("required", []))
    missing_required = sorted(required - set(fixture))
    if missing_required:
        return fail({"fixture_missing_required_fields": missing_required})
    if fixture.get("approval_status") not in VALID_STATUSES:
        return fail({"invalid_approval_status": fixture.get("approval_status")})
    if fixture.get("source_basis") == "ai_generated" and fixture.get("approval_status") == "verified_live":
        return fail({"unsafe_fixture_state": "ai generated item cannot be verified live without explicit approval path"})

    corpus = "\n".join([
        (root / "SKILL.md").read_text(encoding="utf-8"),
        (root / "references/file-routing-index.md").read_text(encoding="utf-8"),
        (root / "references/future-skill-architecture.md").read_text(encoding="utf-8"),
    ])
    missing_routes = [term for term in ROUTE_TERMS if term not in corpus]
    if missing_routes:
        return fail({"bulk_metadata_routes_missing": missing_routes})

    print("bulk metadata governance validation passed")
    return 0


if __name__ == "__main__":
    sys.exit(main(*(sys.argv[1:] or [])))
