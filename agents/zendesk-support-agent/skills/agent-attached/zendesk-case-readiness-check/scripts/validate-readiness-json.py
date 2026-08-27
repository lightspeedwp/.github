#!/usr/bin/env python3
"""Validate structured Zendesk case readiness JSON output.

This script is intentionally dependency-free so it can run in shared agents,
Codex, or local review environments without installing packages.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

TARGET_DELIVERABLES = {
    "customer_reply",
    "internal_escalation",
    "knowledge_drafting",
    "support_handoff",
    "downstream_engineering_product_handoff",
}

READINESS_STATUSES = {"ready", "partially_ready", "not_ready"}

REQUIRED_TOP_LEVEL = {
    "target_deliverable",
    "readiness_status",
    "confirmed_evidence",
    "missing_evidence",
    "next_step",
}

ALLOWED_TOP_LEVEL = REQUIRED_TOP_LEVEL | {"risk_if_skipped"}
ALLOWED_MISSING_EVIDENCE = {"blocker", "optional_improvement"}


def fail(errors: list[str]) -> int:
    print("Readiness JSON validation failed:", file=sys.stderr)
    for error in errors:
        print(f"- {error}", file=sys.stderr)
    return 1


def expect_string(value: Any, path: str, errors: list[str], *, allow_empty: bool = False) -> None:
    if not isinstance(value, str):
        errors.append(f"{path} must be a string")
        return
    if not allow_empty and not value.strip():
        errors.append(f"{path} must not be empty")


def validate_payload(payload: Any) -> list[str]:
    errors: list[str] = []

    if not isinstance(payload, dict):
        return ["root value must be a JSON object"]

    unknown_keys = set(payload) - ALLOWED_TOP_LEVEL
    missing_keys = REQUIRED_TOP_LEVEL - set(payload)
    if unknown_keys:
        errors.append("unknown top-level keys: " + ", ".join(sorted(unknown_keys)))
    if missing_keys:
        errors.append("missing required keys: " + ", ".join(sorted(missing_keys)))

    target = payload.get("target_deliverable")
    if target not in TARGET_DELIVERABLES:
        errors.append(
            "target_deliverable must be one of: " + ", ".join(sorted(TARGET_DELIVERABLES))
        )

    status = payload.get("readiness_status")
    if status not in READINESS_STATUSES:
        errors.append(
            "readiness_status must be one of: " + ", ".join(sorted(READINESS_STATUSES))
        )

    evidence = payload.get("confirmed_evidence")
    if not isinstance(evidence, list):
        errors.append("confirmed_evidence must be an array")
    else:
        for index, item in enumerate(evidence):
            expect_string(item, f"confirmed_evidence[{index}]", errors)

    missing = payload.get("missing_evidence")
    if not isinstance(missing, dict):
        errors.append("missing_evidence must be an object")
    else:
        unknown_missing = set(missing) - ALLOWED_MISSING_EVIDENCE
        if unknown_missing:
            errors.append(
                "unknown missing_evidence keys: " + ", ".join(sorted(unknown_missing))
            )
        if "blocker" not in missing:
            errors.append("missing_evidence.blocker is required")
        else:
            expect_string(missing.get("blocker"), "missing_evidence.blocker", errors)
        if "optional_improvement" in missing:
            expect_string(
                missing.get("optional_improvement"),
                "missing_evidence.optional_improvement",
                errors,
                allow_empty=True,
            )

    if "next_step" in payload:
        expect_string(payload.get("next_step"), "next_step", errors)
    if "risk_if_skipped" in payload:
        expect_string(payload.get("risk_if_skipped"), "risk_if_skipped", errors)

    return errors


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Validate JSON output for the Zendesk case readiness check skill."
    )
    parser.add_argument("json_file", help="Path to a JSON file containing one readiness check object.")
    args = parser.parse_args()

    path = Path(args.json_file)
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return fail([f"file not found: {path}"])
    except json.JSONDecodeError as exc:
        return fail([f"invalid JSON: {exc}"])

    errors = validate_payload(payload)
    if errors:
        return fail(errors)

    print("Readiness JSON validation passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
