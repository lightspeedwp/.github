#!/usr/bin/env python3
"""Validate access-aware remediation files and sample JSON."""
from pathlib import Path
import json
import sys

REQUIRED_FILES = [
    "references/access-level-workflow.md",
    "references/remediation-backlog-model.md",
    "templates/yoast-remediation-backlog.md",
    "templates/wordpress-admin-change-plan.md",
    "schemas/remediation-item.schema.json",
    "fixtures/sample-remediation-item.json",
    "tests/access-remediation-scenario-tests.md",
]

REQUIRED_TERMS = [
    "settings export",
    "rendered source",
    "wordpress_admin",
    "verify_first",
    "decision_record_needed",
]


def fail(payload):
    print(payload)
    return 1


def main(root="."):
    root = Path(root)
    missing = [p for p in REQUIRED_FILES if not (root / p).exists()]
    if missing:
        return fail({"missing_remediation_files": missing})

    corpus = "\n".join((root / p).read_text(encoding="utf-8") for p in REQUIRED_FILES if p.endswith(".md"))
    missing_terms = [term for term in REQUIRED_TERMS if term not in corpus]
    if missing_terms:
        return fail({"missing_required_terms": missing_terms})

    schema = json.loads((root / "schemas/remediation-item.schema.json").read_text(encoding="utf-8"))
    sample = json.loads((root / "fixtures/sample-remediation-item.json").read_text(encoding="utf-8"))

    required = set(schema.get("required", []))
    missing_sample_keys = sorted(required - set(sample.keys()))
    if missing_sample_keys:
        return fail({"sample_missing_required_keys": missing_sample_keys})

    enum_checks = {
        "evidence_state": "evidence_state",
        "access_level": "access_level",
        "severity": "severity",
        "priority": "priority",
        "owner": "owner",
        "implementation_route": "implementation_route",
    }
    props = schema.get("properties", {})
    invalid = {}
    for sample_key, schema_key in enum_checks.items():
        allowed = props.get(schema_key, {}).get("enum", [])
        if sample.get(sample_key) not in allowed:
            invalid[sample_key] = sample.get(sample_key)
    if invalid:
        return fail({"invalid_enum_values": invalid})

    print({"remediation_pack": "ok", "files_checked": len(REQUIRED_FILES)})
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "."))
