#!/usr/bin/env python3
"""Lightweight validator for Gravity Forms auditor JSON artifacts.

This script does not connect to live sites. It checks that JSON files contain
required top-level fields expected by the bundled schemas. It is intentionally
small and dependency-free so agents can run it locally when preparing example
outputs or handoff packets.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

REQUIRED = {
    "audit-intake": ["site_url", "environment", "audit_type", "audience", "scope", "mcp_connection_status", "output_type_requested"],
    "readonly-preflight": ["site_url", "environment", "wordpress_version", "php_version", "gravity_forms_status", "gravity_forms_version", "mcp_capabilities", "missing_evidence"],
    "audit-finding": ["finding_id", "title", "category", "severity", "confidence", "evidence", "affected_object", "user_impact", "business_impact", "recommended_fix", "owner_recommendation", "handoff_required", "retest_step"],
    "configuration-handoff": ["handoff_title", "source_audit", "findings_included", "target_form_page_addon", "proposed_remediation", "required_mcp_capabilities", "approval_requirements", "risk_level", "validation_steps", "rollback_notes", "suggested_configuration_prompt"],
}


def detect_kind(data: dict) -> str | None:
    if "handoff_title" in data:
        return "configuration-handoff"
    if "finding_id" in data:
        return "audit-finding"
    if "gravity_forms_status" in data:
        return "readonly-preflight"
    if "audit_type" in data:
        return "audit-intake"
    return None


def validate(path: Path) -> list[str]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        return [f"{path}: expected a JSON object"]
    kind = detect_kind(data)
    if not kind:
        return [f"{path}: could not detect artifact type"]
    missing = [field for field in REQUIRED[kind] if field not in data]
    return [f"{path}: missing required field '{field}'" for field in missing]


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print("Usage: validate_audit_artifacts.py <artifact.json> [...]")
        return 2
    errors: list[str] = []
    for item in argv[1:]:
        try:
            errors.extend(validate(Path(item)))
        except Exception as exc:  # noqa: BLE001 - CLI should report all file errors.
            errors.append(f"{item}: {exc}")
    if errors:
        print("Validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1
    print("Validation passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
