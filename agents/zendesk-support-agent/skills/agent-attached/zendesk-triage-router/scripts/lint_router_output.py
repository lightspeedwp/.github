#!/usr/bin/env python3
"""Lint zendesk-triage-router outputs for structure and safety.

This script is a maintenance helper for shared-agent admins. It does not call
Zendesk, evaluate truth, or simulate model reasoning. It checks a saved or
pasted router response for required sections, allowed triage enum values, and
common unsafe routing patterns.

Usage:
  python3 scripts/lint_router_output.py output.md
  cat output.md | python3 scripts/lint_router_output.py -
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

CANONICAL_WORKFLOWS = {
    "zendesk-triage-router",
    "zendesk-router-skill",
    "zendesk-evidence-collector",
    "zendesk-customer-research",
    "zendesk-draft-response",
    "zendesk-customer-escalation",
    "zendesk-handoff-prep",
    "zendesk-case-readiness-check",
    "zendesk-duplicate-pattern-review",
    "zendesk-knowledge-candidate-review",
    "zendesk-create-knowledge",
    "zendesk-backlog-trend-analysis",
    "zendesk-evidence-quality-review",
}

LEGACY_WORKFLOWS = {"-".join(parts) for parts in [
    ("case", "investigation"),
    ("customer", "research"),
    ("draft", "response"),
    ("customer", "escalation"),
    ("create", "knowledge"),
    ("backlog", "trend", "analysis"),
    ("evidence", "quality", "review"),
]}

DISALLOWED_PRIMARY_WORKFLOWS = {
    "ticket-triage",
    "linear-triage-router",
    "linear-gap-analyzer",
    "linear-the-architect",
    "linear-duplicate-management-playbook",
    "linear-voice-of-customer",
    "github",
    "asana",
    "linear",
} | LEGACY_WORKFLOWS

ISSUE_TYPES = {
    "Bug",
    "How-to / Configuration",
    "Feature request",
    "Billing / Contract",
    "Account / Access",
    "Integration / API",
    "Security / Privacy / Compliance",
    "Data / Import / Export",
    "Performance / Reliability",
}
SEVERITIES = {"Critical", "High", "Medium", "Low", "Unknown"}
PRIORITIES = {"Urgent", "High", "Normal", "Low", "Unknown"}
DUPLICATE_RISK = {"High", "Medium", "Low", "Not completed"}
OWNER_TEAMS = {
    "Frontline support",
    "Senior / technical support",
    "Engineering",
    "Product",
    "Security / compliance",
    "Billing / finance / operations",
}

PRIMARY_RE = re.compile(r"^\s*-?\s*\*\*Primary workflow:\*\*\s*`?([^`\n]+?)`?\s*$", re.I | re.M)
OPTIONAL_RE = re.compile(r"^\s*-?\s*\*\*Optional supporting workflow:\*\*\s*`?([^`\n]+?)`?\s*$", re.I | re.M)
FIELD_RE = re.compile(r"^\s*\*\*([^:*]+):\*\*\s*(.+?)\s*$", re.M)
WORD_RE = re.compile(r"\b\w+\b")


def read_text(path_arg: str) -> str:
    if path_arg == "-":
        return sys.stdin.read()
    return Path(path_arg).read_text(encoding="utf-8")


def strip_ticks(value: str) -> str:
    return value.strip().strip("`").strip()


def lint_routing(text: str, warnings: list[str], errors: list[str]) -> None:
    primary_matches = [strip_ticks(match.group(1)) for match in PRIMARY_RE.finditer(text)]
    if len(primary_matches) != 1:
        errors.append(f"routing output must contain exactly one Primary workflow line, found {len(primary_matches)}")
    else:
        primary = primary_matches[0]
        if primary in DISALLOWED_PRIMARY_WORKFLOWS:
            errors.append(f"disallowed primary workflow: {primary}")
        elif primary not in CANONICAL_WORKFLOWS and primary.lower() not in {"none", "not attached", "unavailable"}:
            errors.append(f"unknown primary workflow: {primary}")

    optional_matches = [strip_ticks(match.group(1)) for match in OPTIONAL_RE.finditer(text)]
    if len(optional_matches) != 1:
        errors.append(f"routing output must contain exactly one Optional supporting workflow line, found {len(optional_matches)}")
    else:
        optional = optional_matches[0]
        allowed_optional = CANONICAL_WORKFLOWS | {"none"}
        if optional not in allowed_optional:
            errors.append(f"unknown optional supporting workflow: {optional}")

    for section in ["## Why this route fits", "## Next deliverable"]:
        if section not in text:
            errors.append(f"routing output missing section: {section}")

    if "ticket-triage" in text and "do not route" not in text.lower() and "not recommended" not in text.lower():
        errors.append("output mentions ticket-triage without clearly rejecting it")


def lint_triage(text: str, warnings: list[str], errors: list[str]) -> None:
    fields = {match.group(1).strip(): strip_ticks(match.group(2)) for match in FIELD_RE.finditer(text)}
    required = ["Issue type", "Severity", "Recommended priority", "Recommended owner/team", "Duplicate risk"]
    for field in required:
        if field not in fields:
            errors.append(f"triage output missing field: {field}")

    if fields.get("Issue type") and fields["Issue type"] not in ISSUE_TYPES:
        errors.append(f"invalid Issue type: {fields['Issue type']}")
    if fields.get("Severity") and fields["Severity"] not in SEVERITIES:
        errors.append(f"invalid Severity: {fields['Severity']}")
    if fields.get("Recommended priority") and fields["Recommended priority"] not in PRIORITIES:
        errors.append(f"invalid Recommended priority: {fields['Recommended priority']}")
    if fields.get("Duplicate risk") and fields["Duplicate risk"] not in DUPLICATE_RISK:
        errors.append(f"invalid Duplicate risk: {fields['Duplicate risk']}")
    owner = fields.get("Recommended owner/team")
    if owner and owner not in OWNER_TEAMS:
        warnings.append(f"owner/team is not one of the standard categories: {owner}")

    for section in ["### Summary", "### Evidence", "### Unknowns", "### Recommended next step"]:
        if section not in text:
            errors.append(f"triage output missing section: {section}")

    if fields.get("Severity") == "Urgent":
        errors.append("Urgent is a priority, not a severity")
    if fields.get("Recommended priority") in {"Critical", "Medium"}:
        errors.append("Critical/Medium are severities, not recommended priorities")


def lint_general(text: str, warnings: list[str], errors: list[str]) -> None:
    word_count = len(WORD_RE.findall(text))
    if word_count > 800:
        warnings.append(f"output is long for a router response ({word_count} words); consider tightening")

    lower = text.lower()
    if "i checked zendesk" in lower or "zendesk confirms" in lower:
        if "pasted" in lower or "supplied evidence" in lower:
            warnings.append("output claims Zendesk confirmation while also relying on supplied evidence; verify source wording")

    risky_phrases = [
        "definitely a duplicate",
        "root cause is",
        "engineering must fix",
        "create a github issue now",
        "route to all",
    ]
    for phrase in risky_phrases:
        if phrase in lower:
            warnings.append(f"risky wording found: {phrase}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Lint a zendesk-triage-router response")
    parser.add_argument("path", help="Path to response markdown, or '-' for stdin")
    parser.add_argument("--strict", action="store_true", help="Treat warnings as failures")
    args = parser.parse_args()

    text = read_text(args.path)
    errors: list[str] = []
    warnings: list[str] = []

    has_routing = "## Recommended route" in text
    has_triage = "## Triage" in text

    if has_routing and has_triage:
        errors.append("output should not contain both routing and embedded triage formats")
    elif has_routing:
        lint_routing(text, warnings, errors)
    elif has_triage:
        lint_triage(text, warnings, errors)
    else:
        errors.append("output must use either ## Recommended route or ## Triage format")

    lint_general(text, warnings, errors)

    if warnings:
        print("Router output lint warnings:")
        for warning in warnings:
            print(f"- {warning}")

    if errors or (args.strict and warnings):
        print("Router output lint failed:")
        for error in errors:
            print(f"- {error}")
        if args.strict and warnings:
            print("- strict mode treats warnings as failures")
        return 1

    print("Router output lint passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
