#!/usr/bin/env python3
"""Validate Markdown files in tests, templates, examples, and memory."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from typing import Callable

WORKSPACE_ROOT = Path(".")


class ValidationError(Exception):
    pass


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except Exception as exc:  # pragma: no cover
        raise ValidationError(f"Could not read {path}: {exc}") from exc


def has_h1(text: str) -> bool:
    return bool(re.search(r"^#\s+.+", text, flags=re.MULTILINE))


def extract_headings(text: str) -> list[str]:
    headings: list[str] = []
    for line in text.splitlines():
        if line.startswith("#"):
            headings.append(re.sub(r"^#+\s*", "", line).strip())
    return headings


def has_any_heading(text: str, headings: list[str]) -> bool:
    normalised = {h.strip().lower() for h in headings}
    for heading in extract_headings(text):
        if heading.strip().lower() in normalised:
            return True
    return False


def contains_placeholder_markers(text: str) -> bool:
    return any(token in text for token in ["## ", "- ", "1. ", "<", "[ ]", ":"])


def validate_generic_markdown(path: Path, text: str) -> list[str]:
    issues: list[str] = []
    if not has_h1(text):
        issues.append("missing top-level title heading")
    if len(text.strip()) < 80:
        issues.append("content is too short to be a useful reference")
    return issues


TEMPLATE_HEADINGS = {
    "design-critique-template.md": ["Artifact", "Goal", "Top issues", "Recommendations", "Accessibility notes", "Open questions"],
    "implementation-handoff-template.md": ["Scope", "Behaviours", "States", "Dependencies", "Edge cases", "Acceptance criteria", "Open questions"],
    "research-synthesis-template.md": ["Inputs reviewed", "Core findings", "Tensions", "Design implications", "Opportunities", "Open questions"],
    "ux-writing-template.md": ["Surface or moment", "User goal", "Current copy", "Recommended copy options", "Tone and brand notes", "Accessibility and clarity checks"],
    "client-review-brief-template.md": ["Client or project", "Surface or artifact under review", "Goal of the review", "Known constraints", "Source materials", "Questions to answer", "Output needed"],
    "review-history-entry-template.md": ["Review"],
    "reference-site-analysis-template.md": ["URLs analyzed", "Directly verified observations", "Open questions"],
}

EXAMPLE_HEADINGS = {
    "design-critique-example.md": ["Goal", "Top issues", "Recommendations", "Accessibility notes"],
    "woo-product-page-critique-example.md": ["Top issues", "Recommendations", "Accessibility notes"],
    "tour-booking-audit-example.md": ["Context", "Key findings", "Improvement opportunities", "Follow-up questions"],
    "publishing-homepage-audit-example.md": ["Goal", "Key findings", "Recommendations", "Open questions"],
    "research-synthesis-example.md": ["Inputs", "Core findings", "Tensions", "Design implications", "Opportunities"],
    "design-brief-example.md": ["Problem", "Goals", "Audience", "Constraints", "Open questions"],
    "ux-writing-example.md": ["Surface or moment", "Current copy", "Recommended copy options"],
    "implementation-handoff-example.md": ["Scope", "Behaviours", "Acceptance criteria"],
    "reference-site-analysis-example.md": ["URLs analyzed", "Directly verified observations", "Open questions"],
}


def validate_templates_file(path: Path, text: str) -> list[str]:
    issues = validate_generic_markdown(path, text)
    if path.name == "README.md":
        return issues
    required_headings = TEMPLATE_HEADINGS.get(path.name, [])
    for heading in required_headings:
        if not has_any_heading(text, [heading]):
            issues.append(f"missing required heading: {heading}")
    if not contains_placeholder_markers(text):
        issues.append("template does not appear to contain reusable placeholder structure")
    return issues


def validate_examples_file(path: Path, text: str) -> list[str]:
    issues = validate_generic_markdown(path, text)
    if path.name == "README.md":
        return issues
    required_headings = EXAMPLE_HEADINGS.get(path.name, [])
    for heading in required_headings:
        if not has_any_heading(text, [heading]):
            issues.append(f"missing required heading: {heading}")
    return issues


def validate_memory_file(path: Path, text: str) -> list[str]:
    issues = validate_generic_markdown(path, text)
    lowered = text.lower()
    if path.name == "user-preferences.md":
        forbidden = ["### review", "client or project name", "starter baseline entry"]
        if any(token in lowered for token in forbidden):
            issues.append("appears to mix reusable client patterns or review logs into user preferences")
    elif path.name == "todos.md":
        if "- [ ]" not in text:
            issues.append("missing checklist-style active follow-ups")
        if "### review" in lowered or "starter baseline entry" in lowered:
            issues.append("appears to mix review-history entries into to-dos")
    elif path.name == "review-history.md":
        if not has_any_heading(text, ["Starter baseline entry", "Review"]):
            issues.append("missing review-history entry structure")
    elif path.name == "project-defaults.md":
        if not has_any_heading(text, ["Reusable client-pattern starters", "Default source hierarchy"]):
            issues.append("missing reusable project-default structure")
    elif path.name == "client-engagement-template.md":
        if not has_any_heading(text, ["Client or project name", "Business goal", "Open questions that still recur"]):
            issues.append("missing reusable client engagement starter sections")
    return issues


def validate_tests_file(path: Path, text: str) -> list[str]:
    issues = validate_generic_markdown(path, text)
    if path.name == "README.md":
        return issues
    if not has_any_heading(text, ["Scope"]):
        issues.append("missing Scope section")
    if not has_any_heading(text, ["Validation rules", "Core checks", "Grounding checks", "Voice checks", "Folder-level validation checks"]):
        issues.append("missing validation/checks section")
    return issues


VALIDATORS: dict[str, Callable[[Path, str], list[str]]] = {
    "templates": validate_templates_file,
    "examples": validate_examples_file,
    "memory": validate_memory_file,
    "tests": validate_tests_file,
}


def iter_markdown_files(folder: Path) -> list[Path]:
    return sorted(p for p in folder.glob("*.md") if p.is_file())


def validate_folder(folder_name: str) -> int:
    folder = WORKSPACE_ROOT / folder_name
    validator = VALIDATORS[folder_name]
    if not folder.exists():
        print(f"[WARN] {folder_name}: folder does not exist")
        return 0

    failures = 0
    files = iter_markdown_files(folder)
    if not files:
        print(f"[WARN] {folder_name}: no markdown files found")
        return 0

    for path in files:
        text = read_text(path)
        issues = validator(path, text)
        if issues:
            failures += 1
            print(f"[FAIL] {path}")
            for issue in issues:
                print(f"  - {issue}")
        else:
            print(f"[OK]   {path}")

    return failures


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate markdown folders for this agent")
    parser.add_argument("folders", nargs="*", choices=sorted(VALIDATORS.keys()), default=sorted(VALIDATORS.keys()), help="Folders to validate")
    args = parser.parse_args()

    total_failures = 0
    for folder_name in args.folders:
        total_failures += validate_folder(folder_name)

    if total_failures:
        print(f"\nValidation failed with {total_failures} file(s) reporting issues.")
        return 1

    print("\nAll requested markdown folder validations passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
