#!/usr/bin/env python3
"""Lightweight validator for WooCommerce Gravity Forms auditor artifacts.

This script does not connect to live sites. It checks that JSON files contain
required top-level fields expected by the bundled schemas. With --scan-skill it
also checks this skill folder for stale non-WooCommerce routing language.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

REQUIRED = {
    "audit-intake": ["site_url", "environment", "audit_type", "audience", "scope", "mcp_connection_status", "output_type_requested"],
    "readonly-preflight": ["site_url", "environment", "wordpress_version", "php_version", "gravity_forms_status", "gravity_forms_version", "woocommerce_status", "mcp_capabilities", "missing_evidence"],
    "audit-finding": ["finding_id", "title", "category", "severity", "confidence", "evidence", "affected_object", "woocommerce_context", "user_impact", "business_impact", "recommended_fix", "owner_recommendation", "handoff_required", "retest_step"],
    "configuration-handoff": ["handoff_title", "source_audit", "findings_included", "woocommerce_context", "target_form_page_addon", "proposed_remediation", "required_mcp_capabilities", "approval_requirements", "risk_level", "validation_steps", "rollback_notes", "suggested_configuration_prompt"],
}

SKIP_SUFFIXES = {".svg", ".png", ".jpg", ".jpeg", ".gif", ".zip", ".pyc"}


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
    errors = [f"{path}: missing required field '{field}'" for field in missing]
    if kind == "configuration-handoff":
        target = data.get("target_skill")
        expected = "woocommerce-" + "gravity-forms-" + "configuration"
        if target is not None and target != expected:
            errors.append(f"{path}: target_skill must be '{expected}'")
    return errors


def stale_reference_patterns() -> list[tuple[str, re.Pattern[str]]]:
    generic_config = "gravity-forms-" + "configuration"
    generic_auditor = "gravity-forms-" + "auditor"
    disallowed_sector_terms = [
        "to" + "ur operator",
        "to" + "ur\\b",
        "desti" + "nation",
        "itiner" + "ary",
        "accommo" + "dation",
        "booking" + " enquiry",
        "tra" + "vel",
    ]
    return [
        ("generic configuration target", re.compile(rf"(?<!woocommerce-){generic_config}", re.I)),
        ("generic auditor target", re.compile(rf"(?<!woocommerce-){generic_auditor}", re.I)),
        ("sector-specific non-WooCommerce language", re.compile("|".join(disallowed_sector_terms), re.I)),
    ]


def scan_skill(root: Path) -> list[str]:
    errors: list[str] = []
    patterns = stale_reference_patterns()
    for path in sorted(root.rglob("*")):
        if not path.is_file() or path.suffix.lower() in SKIP_SUFFIXES:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        for label, pattern in patterns:
            match = pattern.search(text)
            if match:
                line = text.count("\n", 0, match.start()) + 1
                errors.append(f"{path}: stale {label} on line {line}")
    return errors


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print("Usage: validate_audit_artifacts.py [--scan-skill <skill-dir>] <artifact.json> [...]")
        return 2

    args = argv[1:]
    errors: list[str] = []

    if "--scan-skill" in args:
        idx = args.index("--scan-skill")
        try:
            skill_dir = Path(args[idx + 1])
        except IndexError:
            print("--scan-skill requires a directory")
            return 2
        errors.extend(scan_skill(skill_dir))
        del args[idx:idx + 2]

    for item in args:
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
