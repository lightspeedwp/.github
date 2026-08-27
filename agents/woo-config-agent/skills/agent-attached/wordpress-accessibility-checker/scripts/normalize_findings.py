#!/usr/bin/env python3
"""Normalise Accessibility Checker CSV or JSON exports into a consistent issue register.

The script intentionally uses only the Python standard library so it can run in a
plain skill execution environment.
"""
from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path
from typing import Any, Dict, Iterable, List

FIELD_ALIASES = {
    "issue_id": ["issue id", "id", "rule id", "check id", "finding id"],
    "title": ["issue", "finding", "title", "rule", "check", "message"],
    "url": ["url", "page url", "permalink", "link"],
    "content_type": ["content type", "post type", "type"],
    "content_id": ["content id", "post id", "id"],
    "source_area": ["element", "selector", "source", "location", "context"],
    "status": ["status", "state"],
}

SEVERITY_KEYWORDS = [
    ("blocker", ["keyboard trap", "checkout", "cannot submit", "empty button", "empty link"]),
    ("serious", ["missing form label", "form label", "missing alt", "missing image alt", "empty link", "empty button", "aria"]),
    ("moderate", ["heading", "contrast", "table header", "caption", "transcript", "vague link"]),
    ("minor", ["redundant", "suspicious", "metadata", "title attribute"]),
]

OWNER_KEYWORDS = [
    ("content", ["alt", "link text", "vague link", "heading", "caption", "transcript", "table header"]),
    ("developer", ["contrast", "aria", "keyboard", "focus", "modal", "menu", "slider", "template"]),
    ("manual qa", ["pdf", "document", "video", "audio"]),
]

SAFE_KEYWORDS = ["alt", "link text", "vague link", "heading", "caption", "table header"]
UNSAFE_KEYWORDS = ["contrast", "aria", "keyboard", "focus", "modal", "menu", "slider", "checkout", "pdf"]


def normalise_key(key: str) -> str:
    return " ".join(key.strip().lower().replace("_", " ").split())


def get_value(row: Dict[str, Any], target: str) -> str:
    lookup = {normalise_key(k): v for k, v in row.items()}
    for alias in FIELD_ALIASES[target]:
        if alias in lookup and lookup[alias] not in (None, ""):
            return str(lookup[alias]).strip()
    return ""


def classify_severity(title: str) -> str:
    text = title.lower()
    for severity, keywords in SEVERITY_KEYWORDS:
        if any(keyword in text for keyword in keywords):
            return severity
    return "needs review"


def classify_owner(title: str) -> str:
    text = title.lower()
    for owner, keywords in OWNER_KEYWORDS:
        if any(keyword in text for keyword in keywords):
            return owner
    return "unknown"


def is_safe_to_fix(title: str) -> bool:
    text = title.lower()
    if any(keyword in text for keyword in UNSAFE_KEYWORDS):
        return False
    return any(keyword in text for keyword in SAFE_KEYWORDS)


def recommended_fix(title: str) -> str:
    text = title.lower()
    if "alt" in text:
        return "Inspect image purpose and add concise alt text for informative images or mark decorative images appropriately."
    if "vague link" in text or "link text" in text:
        return "Replace vague link text with destination-specific text that works out of context."
    if "heading" in text:
        return "Review the page outline and adjust editable headings to a logical hierarchy without using headings for visual size."
    if "contrast" in text:
        return "Verify rendered colours and adjust theme tokens or block styles through design/developer workflow."
    if "form label" in text:
        return "Inspect the form tool and add visible or programmatic labels plus clear validation messaging."
    return "Verify the finding, confirm the user impact, and choose the smallest safe remediation path."


def normalise_rows(rows: Iterable[Dict[str, Any]]) -> List[Dict[str, Any]]:
    findings: List[Dict[str, Any]] = []
    for index, row in enumerate(rows, start=1):
        title = get_value(row, "title") or "Untitled accessibility finding"
        issue_id = get_value(row, "issue_id") or f"finding-{index:04d}"
        status = (get_value(row, "status") or "open").lower()
        finding = {
            "issue_id": issue_id,
            "title": title,
            "url": get_value(row, "url"),
            "content_type": get_value(row, "content_type"),
            "content_id": get_value(row, "content_id"),
            "source_area": get_value(row, "source_area"),
            "selector": get_value(row, "source_area") or None,
            "severity": classify_severity(title),
            "confidence": "medium",
            "status": status,
            "owner": classify_owner(title),
            "safe_to_fix": is_safe_to_fix(title),
            "recommended_fix": recommended_fix(title),
            "evidence": [],
            "manual_follow_up": [],
            "raw": row,
        }
        findings.append(finding)
    return findings


def load_input(path: Path) -> List[Dict[str, Any]]:
    suffix = path.suffix.lower()
    if suffix == ".csv":
        with path.open(newline="", encoding="utf-8-sig") as handle:
            return list(csv.DictReader(handle))
    if suffix == ".json":
        data = json.loads(path.read_text(encoding="utf-8"))
        if isinstance(data, dict):
            if "findings" in data and isinstance(data["findings"], list):
                return data["findings"]
            return [data]
        if isinstance(data, list):
            return data
    raise SystemExit(f"Unsupported input format: {path.suffix}. Use CSV or JSON.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Normalise Accessibility Checker findings.")
    parser.add_argument("input", type=Path, help="CSV or JSON findings export")
    parser.add_argument("--output", "-o", type=Path, help="Output JSON path. Defaults to stdout.")
    args = parser.parse_args()

    findings = normalise_rows(load_input(args.input))
    payload = {"findings": findings, "count": len(findings)}
    text = json.dumps(payload, indent=2, ensure_ascii=False)
    if args.output:
        args.output.write_text(text + "\n", encoding="utf-8")
    else:
        print(text)


if __name__ == "__main__":
    main()
