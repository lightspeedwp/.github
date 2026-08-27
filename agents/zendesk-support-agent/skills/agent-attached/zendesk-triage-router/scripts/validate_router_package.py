#!/usr/bin/env python3
"""Validate shared-agent safety checks for the zendesk-triage-router skill package.

This script is intentionally lightweight and uses only Python's standard library.
It complements the platform skill packager by checking router-specific conventions.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

REQUIRED_FILES = [
    "SKILL.md",
    "agents/openai.yaml",
    "assets/icon.svg",
    "references/shared-agent-portability.md",
    "references/access-and-permissions.md",
    "references/parent-agent-routing.md",
    "references/routing-boundaries.md",
    "references/zendesk-field-map.md",
    "references/routing-output-quality-checklist.md",
    "references/router-output-lint-examples.md",
    "references/parent-agent-installation-checklist.md",
    "references/workflow-namespace-map.yaml",
    "references/attached-skill-manifest.yaml",
    "references/legacy-aliases.md",
    "references/routing-decision-matrix.yaml",
    "references/triage-output-schema.yaml",
    "references/minimum-zendesk-evidence-checklist.md",
    "references/synthetic-test-scenarios.md",
    "references/router-regression-cases.json",
    "scripts/run_router_regression_tests.py",
    "scripts/lint_router_output.py",
]

REQUIRED_SKILL_SNIPPETS = [
    "Use canonical Zendesk-prefixed companion workflow names",
    "Do not route to `ticket-triage`",
    "Downstream deliverables should use canonical `zendesk-` companion skill names",
    "references/shared-agent-portability.md",
    "references/access-and-permissions.md",
    "references/parent-agent-routing.md",
    "references/routing-boundaries.md",
    "references/zendesk-field-map.md",
    "references/routing-output-quality-checklist.md",
    "references/router-output-lint-examples.md",
    "references/parent-agent-installation-checklist.md",
    "references/workflow-namespace-map.yaml",
    "router-regression-cases.json",
    "run_router_regression_tests.py",
    "lint_router_output.py",
]

DISALLOWED_PATTERNS = [
    (re.compile(r"ashley@lsdev\.biz", re.I), "personal email address"),
    (re.compile(r"/Users/[^\s]+"), "local macOS user path"),
    (re.compile(r"C:\\\\Users\\\\", re.I), "local Windows user path"),
    (re.compile(r"real customer ticket", re.I), "real customer data wording"),
]



MARKDOWN_LINK_RE = re.compile(r"\[[^\]]+\]\(([^)]+)\)")


def validate_markdown_links(root: Path, errors: list[str]) -> None:
    """Ensure relative markdown links in bundled docs resolve inside the skill."""
    for path in root.rglob("*.md"):
        content = path.read_text(encoding="utf-8", errors="ignore")
        for match in MARKDOWN_LINK_RE.finditer(content):
            target = match.group(1).strip()
            if not target or target.startswith(("http://", "https://", "mailto:", "#")):
                continue
            clean_target = target.split("#", 1)[0]
            if not clean_target:
                continue
            resolved = (path.parent / clean_target).resolve()
            try:
                resolved.relative_to(root.resolve())
            except ValueError:
                errors.append(f"{path.relative_to(root)} links outside package: {target}")
                continue
            if not resolved.exists():
                errors.append(f"{path.relative_to(root)} has unresolved link: {target}")


def main() -> int:
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd()
    errors: list[str] = []

    for rel in REQUIRED_FILES:
        if not (root / rel).is_file():
            errors.append(f"missing required file: {rel}")

    skill_md = root / "SKILL.md"
    if skill_md.is_file():
        text = skill_md.read_text(encoding="utf-8")
        if not text.startswith("---\n"):
            errors.append("SKILL.md is missing YAML frontmatter")
        name_match = re.search(r"^name:\s*([^\n]+)$", text, flags=re.M)
        if not name_match or name_match.group(1).strip() != "zendesk-triage-router":
            errors.append("SKILL.md frontmatter name must be zendesk-triage-router")
        for snippet in REQUIRED_SKILL_SNIPPETS:
            if snippet not in text:
                errors.append(f"SKILL.md missing required snippet: {snippet}")

    for path in root.rglob("*"):
        if path.is_file() and path.suffix.lower() in {".md", ".yaml", ".yml", ".txt"}:
            content = path.read_text(encoding="utf-8", errors="ignore")
            for pattern, label in DISALLOWED_PATTERNS:
                if pattern.search(content):
                    errors.append(f"{path.relative_to(root)} contains disallowed {label}")

    validate_markdown_links(root, errors)

    if errors:
        print("Router package validation failed:")
        for err in errors:
            print(f"- {err}")
        return 1

    print("Router package validation passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
