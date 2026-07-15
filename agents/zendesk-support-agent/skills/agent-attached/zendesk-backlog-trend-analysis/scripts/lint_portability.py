#!/usr/bin/env python3
"""Lint the skill bundle for shared-agent portability risks.

This optional QA helper looks for accidental personal, local, or connector-specific
assumptions in markdown, YAML, JSON, and Python files. It does not inspect live
Zendesk data and has no network dependencies.
"""

from __future__ import annotations

import argparse
from pathlib import Path

TEXT_SUFFIXES = {".md", ".yaml", ".yml", ".json", ".py", ".txt"}

FORBIDDEN_SNIPPETS = {
    "ash shaw": "personal name should not be required by the shared skill",
    "ashley@": "personal email should not be bundled into a shared skill",
    "/mnt/data": "local sandbox path should not appear in packaged skill content",
    "file_000": "uploaded file IDs should not appear in packaged skill content",
    "my zendesk view": "personal Zendesk view assumption",
    "usual zendesk view": "login-specific Zendesk view assumption",
    "hardcoded view id": "hardcoded Zendesk view IDs should not be required",
    "api token": "credentials or token references must not be bundled",
    "password": "credential wording should not appear unless clearly part of a redaction rule",
}

ALLOWED_CONTEXT = {
    "password": ["privacy-redaction-guide.md"],
}


def should_scan(path: Path) -> bool:
    # Validator scripts may contain the exact strings they are designed to detect.
    if path.name in {"lint_portability.py", "validate_capability_profile.py"}:
        return False
    return path.suffix.lower() in TEXT_SUFFIXES and "__pycache__" not in path.parts


def lint_file(path: Path, root: Path) -> list[str]:
    rel = path.relative_to(root)
    text = path.read_text(encoding="utf-8").lower()
    findings: list[str] = []
    for snippet, reason in FORBIDDEN_SNIPPETS.items():
        allowed_files = ALLOWED_CONTEXT.get(snippet, [])
        if path.name in allowed_files:
            continue
        if snippet in text:
            findings.append(f"{rel}: found {snippet!r} ({reason})")
    return findings


def main() -> int:
    parser = argparse.ArgumentParser(description="Lint skill files for shared-agent portability risks.")
    parser.add_argument("root", nargs="?", type=Path, default=Path(__file__).resolve().parent.parent)
    args = parser.parse_args()

    root = args.root.resolve()
    findings: list[str] = []
    for path in sorted(root.rglob("*")):
        if path.is_file() and should_scan(path):
            findings.extend(lint_file(path, root))

    if findings:
        for finding in findings:
            print(f"ERROR: {finding}")
        return 1

    print("Portability lint passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
