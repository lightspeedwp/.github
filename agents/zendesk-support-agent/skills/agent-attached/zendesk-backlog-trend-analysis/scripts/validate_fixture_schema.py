#!/usr/bin/env python3
"""Validate bundled Zendesk backlog fixtures without external dependencies.

This script is an optional packaging QA helper. It intentionally avoids network
calls, Zendesk credentials, or third-party packages so it remains safe in shared
agent environments.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

REPORT_TYPES = {
    "backlog_health",
    "weekly_report",
    "trend_comparison",
    "daily_digest",
    "repeated_theme_review",
    "queue_risk_check",
    "mixed_operational_report",
}

STATUSES = {"new", "open", "pending", "hold", "solved", "closed", "unknown"}
PRIORITIES = {"low", "normal", "high", "urgent", "unknown"}
SLA_STATUSES = {"breached", "at_risk", "ok", "unavailable", "unknown"}
EVIDENCE_CLASSES = {"confirmed", "interpretation", "missing"}

REQUIRED_FIXTURE_KEYS = {"report_type", "scope", "tickets", "capabilities", "missing_evidence"}
REQUIRED_TICKET_KEYS = {
    "ticket_id",
    "subject",
    "status",
    "priority",
    "created_at",
    "updated_at",
    "sla_status",
    "evidence_class",
}


def validate_ticket(ticket: dict[str, Any], path: Path, index: int) -> list[str]:
    errors: list[str] = []
    missing = REQUIRED_TICKET_KEYS - set(ticket)
    if missing:
        errors.append(f"{path.name}: ticket {index} missing keys: {sorted(missing)}")
    if ticket.get("status") not in STATUSES:
        errors.append(f"{path.name}: ticket {index} has invalid status: {ticket.get('status')!r}")
    if ticket.get("priority") not in PRIORITIES:
        errors.append(f"{path.name}: ticket {index} has invalid priority: {ticket.get('priority')!r}")
    if ticket.get("sla_status") not in SLA_STATUSES:
        errors.append(f"{path.name}: ticket {index} has invalid sla_status: {ticket.get('sla_status')!r}")
    if ticket.get("evidence_class") not in EVIDENCE_CLASSES:
        errors.append(f"{path.name}: ticket {index} has invalid evidence_class: {ticket.get('evidence_class')!r}")
    tags = ticket.get("tags", [])
    if not isinstance(tags, list) or not all(isinstance(tag, str) for tag in tags):
        errors.append(f"{path.name}: ticket {index} tags must be a list of strings")
    return errors


def validate_fixture(path: Path) -> list[str]:
    errors: list[str] = []
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        return [f"{path.name}: invalid JSON: {exc}"]

    missing = REQUIRED_FIXTURE_KEYS - set(data)
    if missing:
        errors.append(f"{path.name}: missing keys: {sorted(missing)}")

    if data.get("report_type") not in REPORT_TYPES:
        errors.append(f"{path.name}: invalid report_type: {data.get('report_type')!r}")

    tickets = data.get("tickets")
    if not isinstance(tickets, list):
        errors.append(f"{path.name}: tickets must be a list")
        return errors

    for index, ticket in enumerate(tickets):
        if not isinstance(ticket, dict):
            errors.append(f"{path.name}: ticket {index} must be an object")
            continue
        errors.extend(validate_ticket(ticket, path, index))

    missing_evidence = data.get("missing_evidence", [])
    if not isinstance(missing_evidence, list) or not all(isinstance(item, str) for item in missing_evidence):
        errors.append(f"{path.name}: missing_evidence must be a list of strings")

    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate Zendesk backlog fixture JSON files.")
    parser.add_argument("paths", nargs="*", type=Path, help="Fixture files or directories. Defaults to ../fixtures.")
    args = parser.parse_args()

    script_dir = Path(__file__).resolve().parent
    default_dir = script_dir.parent / "fixtures"
    targets = args.paths or [default_dir]

    files: list[Path] = []
    for target in targets:
        if target.is_dir():
            files.extend(sorted(target.glob("*.json")))
        else:
            files.append(target)

    all_errors: list[str] = []
    for file_path in files:
        all_errors.extend(validate_fixture(file_path))

    if all_errors:
        for error in all_errors:
            print(f"ERROR: {error}")
        return 1

    print(f"Validated {len(files)} fixture file(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
