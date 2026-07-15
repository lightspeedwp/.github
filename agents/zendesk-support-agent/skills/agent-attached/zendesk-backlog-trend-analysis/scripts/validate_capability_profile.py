#!/usr/bin/env python3
"""Validate workspace capability profile examples.

This optional QA helper keeps shared-agent configuration examples portable. It
checks required capability keys, prevents write-by-default profiles, and blocks
personal/local identifiers that would make the skill unsafe to share.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any

REQUIRED_TOP_LEVEL = {
    "version",
    "environment_name",
    "zendesk_read_capabilities",
    "filter_capabilities",
    "visible_ticket_fields",
    "optional_data_visibility",
    "write_actions_allowed_by_default",
    "known_limitations",
    "last_reviewed",
}

READ_CAPABILITY_KEYS = {
    "count_tickets",
    "search_ticket_metadata",
    "read_ticket_details",
    "read_ticket_conversations",
    "search_help_centre",
    "read_help_centre_articles",
    "read_csat_or_satisfaction",
}

FILTER_KEYS = {
    "status",
    "created_date",
    "updated_date",
    "priority",
    "assignee",
    "group",
    "brand",
    "organisation",
    "tag",
    "form",
    "channel",
    "text",
    "custom_field",
}

OPTIONAL_VISIBILITY_KEYS = {"sla", "csat", "comment_count", "custom_fields"}
VISIBILITY_VALUES = {"visible", "not_visible", "uncertain"}
PORTABILITY_PATTERNS = [
    re.compile(r"ash", re.IGNORECASE),
    re.compile(r"ashley@", re.IGNORECASE),
    re.compile(r"/mnt/data", re.IGNORECASE),
    re.compile(r"file_000", re.IGNORECASE),
    re.compile(r"api[_ -]?token", re.IGNORECASE),
    re.compile(r"password", re.IGNORECASE),
]


def require_bool_map(value: Any, required_keys: set[str], label: str, path: Path) -> list[str]:
    errors: list[str] = []
    if not isinstance(value, dict):
        return [f"{path.name}: {label} must be an object"]
    missing = required_keys - set(value)
    if missing:
        errors.append(f"{path.name}: {label} missing keys: {sorted(missing)}")
    for key, item in value.items():
        if not isinstance(item, bool):
            errors.append(f"{path.name}: {label}.{key} must be boolean")
    return errors


def scan_portability(data: Any, path: Path) -> list[str]:
    text = json.dumps(data, sort_keys=True)
    findings: list[str] = []
    for pattern in PORTABILITY_PATTERNS:
        if pattern.search(text):
            findings.append(f"{path.name}: contains non-portable or sensitive text matching {pattern.pattern!r}")
    return findings


def validate_profile(path: Path) -> list[str]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        return [f"{path.name}: invalid JSON: {exc}"]

    if not isinstance(data, dict):
        return [f"{path.name}: top-level JSON must be an object"]

    errors: list[str] = []
    missing = REQUIRED_TOP_LEVEL - set(data)
    if missing:
        errors.append(f"{path.name}: missing top-level keys: {sorted(missing)}")

    if data.get("version") != "1.0":
        errors.append(f"{path.name}: version must be '1.0'")

    environment_name = data.get("environment_name")
    if not isinstance(environment_name, str) or not environment_name.strip():
        errors.append(f"{path.name}: environment_name must be a non-empty string")

    errors.extend(require_bool_map(data.get("zendesk_read_capabilities"), READ_CAPABILITY_KEYS, "zendesk_read_capabilities", path))
    errors.extend(require_bool_map(data.get("filter_capabilities"), FILTER_KEYS, "filter_capabilities", path))

    visible_fields = data.get("visible_ticket_fields")
    if not isinstance(visible_fields, list) or not all(isinstance(item, str) and item.strip() for item in visible_fields):
        errors.append(f"{path.name}: visible_ticket_fields must be a list of non-empty strings")

    optional_visibility = data.get("optional_data_visibility")
    if not isinstance(optional_visibility, dict):
        errors.append(f"{path.name}: optional_data_visibility must be an object")
    else:
        missing_optional = OPTIONAL_VISIBILITY_KEYS - set(optional_visibility)
        if missing_optional:
            errors.append(f"{path.name}: optional_data_visibility missing keys: {sorted(missing_optional)}")
        for key, value in optional_visibility.items():
            if value not in VISIBILITY_VALUES:
                errors.append(f"{path.name}: optional_data_visibility.{key} has invalid value: {value!r}")

    if data.get("write_actions_allowed_by_default") is not False:
        errors.append(f"{path.name}: write_actions_allowed_by_default must be false")

    limitations = data.get("known_limitations")
    if not isinstance(limitations, list) or not all(isinstance(item, str) for item in limitations):
        errors.append(f"{path.name}: known_limitations must be a list of strings")

    last_reviewed = data.get("last_reviewed")
    if not isinstance(last_reviewed, str) or not re.match(r"^\d{4}-\d{2}-\d{2}$", last_reviewed):
        errors.append(f"{path.name}: last_reviewed must use YYYY-MM-DD")

    errors.extend(scan_portability(data, path))
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate workspace capability profile JSON files.")
    parser.add_argument("paths", nargs="*", type=Path, help="Profile JSON files. Defaults to ../fixtures/workspace-capability-profile-example.json.")
    args = parser.parse_args()

    script_dir = Path(__file__).resolve().parent
    targets = args.paths or [script_dir.parent / "profiles" / "workspace-capability-profile-example.json"]

    all_errors: list[str] = []
    for target in targets:
        if target.is_dir():
            files = sorted(target.glob("workspace-capability-profile*.json"))
        else:
            files = [target]
        for file_path in files:
            all_errors.extend(validate_profile(file_path))

    if all_errors:
        for error in all_errors:
            print(f"ERROR: {error}")
        return 1

    print("Validated workspace capability profile file(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
