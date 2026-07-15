#!/usr/bin/env python3
"""Validate Yoast decision-record schema and sample fixture without external dependencies."""
import json
import sys
from pathlib import Path

ALLOWED_STATES = {"proposed", "approved", "implemented", "validated", "blocked", "rejected", "superseded"}
REQUIRED = {
    "decision_id",
    "date",
    "site_or_client",
    "decision_type",
    "state",
    "decision",
    "rationale",
    "risks",
    "qa_required",
}


def fail(payload):
    print(payload)
    return 1


def main(root="."):
    root = Path(root)
    schema_path = root / "schemas/decision-record.schema.json"
    fixture_path = root / "fixtures/sample-decision-record.json"
    model_path = root / "references/decision-register-model.md"
    template_path = root / "templates/yoast-decision-log.md"

    for path in [schema_path, fixture_path, model_path, template_path]:
        if not path.exists():
            return fail({"missing_decision_file": str(path.relative_to(root))})

    schema = json.loads(schema_path.read_text(encoding="utf-8"))
    fixture = json.loads(fixture_path.read_text(encoding="utf-8"))

    missing = sorted(REQUIRED - set(fixture))
    if missing:
        return fail({"missing_required_fixture_fields": missing})
    if fixture.get("state") not in ALLOWED_STATES:
        return fail({"invalid_state": fixture.get("state")})
    if not fixture.get("risks"):
        return fail({"missing_risks": True})
    if not fixture.get("qa_required"):
        return fail({"missing_qa_required": True})

    schema_required = set(schema.get("required", []))
    if not REQUIRED.issubset(schema_required):
        return fail({"schema_missing_required_fields": sorted(REQUIRED - schema_required)})

    print("decision record validation passed")
    return 0


if __name__ == "__main__":
    sys.exit(main(*(sys.argv[1:] or [])))
