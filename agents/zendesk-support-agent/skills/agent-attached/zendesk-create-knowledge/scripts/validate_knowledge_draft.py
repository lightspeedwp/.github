#!/usr/bin/env python3
"""Validate a Zendesk knowledge draft JSON export.

This script is intentionally local-only and dependency-free so it can be used
inside shared agents without relying on Zendesk access, workspace identity, or
personal Memory. It validates structure, required fields, controlled values,
and a small set of public/internal safety signals.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

VALID_TYPES = {"How-to", "Troubleshooting", "FAQ", "Known issue", "Internal note"}
VALID_VISIBILITY = {"Public help centre", "Internal support knowledge", "Needs decision"}
VALID_CONFIDENCE = {"high", "medium", "low"}
VALID_NEXT_ROUTES = {
    "none",
    "zendesk-evidence-quality-review",
    "zendesk-draft-response",
    "zendesk-customer-research",
    "zendesk-evidence-collector",
    "zendesk-case-readiness-check",
    "zendesk-knowledge-candidate-review",
    "zendesk-backlog-trend-analysis",
    "zendesk-duplicate-pattern-review",
    "zendesk-router-skill",
}

REQUIRED_TOP_LEVEL = [
    "title",
    "type",
    "category",
    "audience",
    "visibility",
    "tags",
    "body_markdown",
    "publishing_notes",
]

REQUIRED_PUBLISHING_NOTES = [
    "source",
    "existing_articles_to_update",
    "public_internal_boundary",
    "evidence_confidence",
    "review_needed_from",
    "suggested_review_date",
    "recommended_next_route",
]

# These are intentionally conservative signals, not a complete data-loss-prevention system.
PUBLIC_RISK_PATTERNS = [
    (re.compile(r"\binternal note\b", re.I), "public draft appears to include internal-note wording"),
    (re.compile(r"\bprivate comment\b", re.I), "public draft mentions private comments"),
    (re.compile(r"\b(agent|support) note[s]?\b", re.I), "public draft mentions support notes"),
    (re.compile(r"\bticket\s*#?\d{3,}\b", re.I), "public draft may expose a ticket number"),
    (re.compile(r"\broot cause\b", re.I), "public draft includes root-cause wording that may need evidence review"),
    (re.compile(r"\bETA\b|\broadmap\b|\bwill be fixed\b", re.I), "public draft may imply roadmap or timeline commitment"),
    (re.compile(r"\bblame\b|\bfault\b", re.I), "public draft may include blame language"),
]


def is_non_empty_string(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def add_issue(issues: list[dict[str, str]], severity: str, field: str, message: str) -> None:
    issues.append({"severity": severity, "field": field, "message": message})


def validate_draft(draft: dict[str, Any]) -> dict[str, Any]:
    issues: list[dict[str, str]] = []

    for field in REQUIRED_TOP_LEVEL:
        if field not in draft:
            add_issue(issues, "error", field, "required field is missing")

    for field in ["title", "category", "audience", "visibility", "body_markdown"]:
        if field in draft and not is_non_empty_string(draft[field]):
            add_issue(issues, "error", field, "field must be a non-empty string")

    if "type" in draft:
        if draft["type"] not in VALID_TYPES:
            add_issue(issues, "error", "type", f"must be one of: {', '.join(sorted(VALID_TYPES))}")

    if "visibility" in draft:
        if draft["visibility"] not in VALID_VISIBILITY:
            add_issue(issues, "error", "visibility", f"must be one of: {', '.join(sorted(VALID_VISIBILITY))}")

    if "tags" in draft:
        if not isinstance(draft["tags"], list) or not all(is_non_empty_string(tag) for tag in draft["tags"]):
            add_issue(issues, "error", "tags", "must be a list of non-empty strings")

    notes = draft.get("publishing_notes")
    if not isinstance(notes, dict):
        add_issue(issues, "error", "publishing_notes", "must be an object")
        notes = {}

    for field in REQUIRED_PUBLISHING_NOTES:
        if field not in notes:
            add_issue(issues, "error", f"publishing_notes.{field}", "required field is missing")

    for field in ["source", "public_internal_boundary", "evidence_confidence", "suggested_review_date", "recommended_next_route"]:
        if field in notes and not is_non_empty_string(notes[field]):
            add_issue(issues, "error", f"publishing_notes.{field}", "field must be a non-empty string")

    for field in ["existing_articles_to_update", "review_needed_from"]:
        if field in notes:
            if not isinstance(notes[field], list) or not all(is_non_empty_string(item) for item in notes[field]):
                add_issue(issues, "error", f"publishing_notes.{field}", "must be a list of non-empty strings")

    confidence = notes.get("evidence_confidence")
    if isinstance(confidence, str):
        confidence_value = confidence.strip().lower()
        if confidence_value not in VALID_CONFIDENCE:
            add_issue(issues, "error", "publishing_notes.evidence_confidence", "must be high, medium, or low")
        elif confidence_value in {"medium", "low"}:
            route = str(notes.get("recommended_next_route", "")).strip()
            if not route or route == "none":
                add_issue(issues, "warning", "publishing_notes.recommended_next_route", "medium or low confidence drafts should include a concrete next route")

    route = notes.get("recommended_next_route")
    if isinstance(route, str) and route.strip() and route.strip() not in VALID_NEXT_ROUTES:
        add_issue(issues, "warning", "publishing_notes.recommended_next_route", "route is not one of the expected Zendesk next routes")

    article_type = draft.get("type")
    body = draft.get("body_markdown", "") if isinstance(draft.get("body_markdown"), str) else ""
    body_lower = body.lower()

    if article_type == "Known issue":
        for expected in ["status", "workaround"]:
            if expected not in body_lower and (expected != "workaround" or "mitigation" not in body_lower):
                add_issue(issues, "warning", "body_markdown", f"known issue drafts should include current {expected} information")

    if article_type == "Troubleshooting" and "symptom" not in body_lower:
        add_issue(issues, "warning", "body_markdown", "troubleshooting drafts should include symptoms")

    if article_type == "How-to" and not re.search(r"(^|\n)\s*1\.\s+", body):
        add_issue(issues, "warning", "body_markdown", "how-to drafts should usually include numbered steps")

    if article_type == "FAQ" and not draft.get("title", "").strip().endswith("?"):
        add_issue(issues, "warning", "title", "FAQ titles should usually be phrased as customer questions")

    if draft.get("visibility") == "Public help centre":
        for pattern, message in PUBLIC_RISK_PATTERNS:
            if pattern.search(body):
                add_issue(issues, "warning", "body_markdown", message)

    error_count = sum(1 for issue in issues if issue["severity"] == "error")
    warning_count = sum(1 for issue in issues if issue["severity"] == "warning")

    return {
        "valid": error_count == 0,
        "error_count": error_count,
        "warning_count": warning_count,
        "issues": issues,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate a Zendesk knowledge draft JSON export.")
    parser.add_argument("draft", help="Path to a JSON file containing the draft.")
    parser.add_argument("--pretty", action="store_true", help="Pretty-print the validation report.")
    args = parser.parse_args()

    path = Path(args.draft)
    try:
        with path.open("r", encoding="utf-8") as handle:
            data = json.load(handle)
    except FileNotFoundError:
        print(json.dumps({"valid": False, "error_count": 1, "warning_count": 0, "issues": [{"severity": "error", "field": str(path), "message": "file not found"}]}))
        return 2
    except json.JSONDecodeError as exc:
        print(json.dumps({"valid": False, "error_count": 1, "warning_count": 0, "issues": [{"severity": "error", "field": str(path), "message": f"invalid JSON: {exc}"}]}))
        return 2

    if not isinstance(data, dict):
        report = {"valid": False, "error_count": 1, "warning_count": 0, "issues": [{"severity": "error", "field": "$", "message": "draft JSON must be an object"}]}
    else:
        report = validate_draft(data)

    print(json.dumps(report, indent=2 if args.pretty else None, ensure_ascii=False))
    return 0 if report["valid"] else 1


if __name__ == "__main__":
    sys.exit(main())
