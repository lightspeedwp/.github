#!/usr/bin/env python3
"""Validate evidence-state labels in Yoast skill markdown and JSON files."""
from pathlib import Path
import json
import re
import sys

ALLOWED_STATES = {
    "research target",
    "scanned evidence",
    "verified current source",
    "stale evidence",
    "contradicted evidence",
    "inference",
    "unsupported",
    "needs live verification",
    "unclear from available sources",
    "source not captured",
}

REQUIRED_FILES = [
    "references/evidence-state-model.md",
    "docs/current-verification-playbook.md",
    "references/audit-triage-model.md",
    "templates/yoast-troubleshooting-note.md",
    "schemas/audit-finding.schema.json",
    "fixtures/sample-audit-finding.json",
]

STATE_PATTERN = re.compile(r"`([^`]+)`")


def fail(payload):
    print(payload)
    return 1


def main(root="."):
    root = Path(root)
    missing = [p for p in REQUIRED_FILES if not (root / p).exists()]
    if missing:
        return fail({"missing_evidence_state_files": missing})

    model = (root / "references/evidence-state-model.md").read_text(encoding="utf-8")
    missing_labels = [state for state in ALLOWED_STATES if state not in model]
    if missing_labels:
        return fail({"evidence_model_missing_labels": missing_labels})

    sample_path = root / "fixtures/sample-audit-finding.json"
    sample = json.loads(sample_path.read_text(encoding="utf-8"))
    if sample.get("evidence_state") not in ALLOWED_STATES:
        return fail({"invalid_sample_evidence_state": sample.get("evidence_state")})

    schema = json.loads((root / "schemas/audit-finding.schema.json").read_text(encoding="utf-8"))
    enum = set(schema["properties"]["evidence_state"]["enum"])
    missing_from_schema = sorted((ALLOWED_STATES - {"unclear from available sources", "source not captured"}) - enum)
    if missing_from_schema:
        return fail({"audit_schema_missing_states": missing_from_schema})

    print("evidence state validation passed")
    return 0


if __name__ == "__main__":
    sys.exit(main(*(sys.argv[1:] or [])))
