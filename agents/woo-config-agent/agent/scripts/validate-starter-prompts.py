#!/usr/bin/env python3
"""Validate starter prompt coverage and drift against the current agent focus."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "tests" / "starter-prompt-consistency-source.md"
HEADING_RE = re.compile(r"^##\s+(.+)$", re.MULTILINE)
CODE_TICK_RE = re.compile(r"^`(.+)`$")
TITLE_RE = re.compile(r"^- Title: `(.+)`$")
DESC_RE = re.compile(r"^  - Description: `(.+)`$")
PROMPT_RE = re.compile(r"^  - Prompt: `(.+)`$")
VAGUE_RE = re.compile(r"\b(?:help me|review this|check this|look at this|improve this|make it better)\b", re.IGNORECASE)
STOPWORDS = {"my", "the", "a", "an", "and", "or", "for", "with", "to", "of", "this", "that", "me"}


def parse_sections(text: str) -> dict[str, str]:
    matches = list(HEADING_RE.finditer(text))
    sections: dict[str, str] = {}
    for i, match in enumerate(matches):
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        sections[match.group(1).strip()] = text[start:end].strip()
    return sections


def parse_bullets(section_text: str) -> list[str]:
    items: list[str] = []
    for line in section_text.splitlines():
        stripped = line.strip()
        if stripped.startswith("- "):
            value = stripped[2:].strip()
            code_match = CODE_TICK_RE.match(value)
            items.append(code_match.group(1) if code_match else value)
    return items


def parse_prompt_snapshot(section_text: str) -> list[dict[str, str]]:
    prompts: list[dict[str, str]] = []
    current: dict[str, str] | None = None
    for line in section_text.splitlines():
        if match := TITLE_RE.match(line):
            if current:
                prompts.append(current)
            current = {"title": match.group(1)}
            continue
        if current and (match := DESC_RE.match(line)):
            current["description"] = match.group(1)
            continue
        if current and (match := PROMPT_RE.match(line)):
            current["prompt"] = match.group(1)
            continue
    if current:
        prompts.append(current)
    return prompts


def normalise_intent(text: str) -> str:
    tokens = re.findall(r"[a-z0-9]+", text.lower())
    return " ".join(token for token in tokens if token not in STOPWORDS)


def main() -> int:
    if not SOURCE.exists():
        print(f"Starter-prompt consistency validation failed:\n- Source snapshot is missing: {SOURCE.relative_to(ROOT)}")
        return 1

    text = SOURCE.read_text(encoding="utf-8")
    sections = parse_sections(text)
    failures: list[str] = []

    required_titles = parse_bullets(sections.get("Required starter prompt titles", ""))
    required_themes = parse_bullets(sections.get("Required starter prompt themes", ""))
    forbidden_refs = parse_bullets(sections.get("Forbidden starter prompt references", ""))
    prompt_snapshot = parse_prompt_snapshot(sections.get("Starter prompts snapshot", ""))

    if not prompt_snapshot:
        failures.append("Starter prompts snapshot is empty")

    titles = [item.get("title", "") for item in prompt_snapshot]
    combined_text = "\n".join(
        " ".join(item.get(key, "") for key in ("title", "description", "prompt"))
        for item in prompt_snapshot
    )

    for title in required_titles:
        if title not in titles:
            failures.append(f"Required starter prompt title is missing: {title}")

    for theme in required_themes:
        if theme.lower() not in combined_text.lower():
            failures.append(f"Required starter prompt theme is missing: {theme}")

    for ref in forbidden_refs:
        if ref.lower() in combined_text.lower():
            failures.append(f"Forbidden starter prompt reference is present: {ref}")

    seen_intents: dict[str, str] = {}
    for item in prompt_snapshot:
        title = item.get("title", "<untitled>")
        description = item.get("description", "")
        prompt = item.get("prompt", "")
        if not description:
            failures.append(f"Starter prompt is missing a description: {title}")
        if not prompt:
            failures.append(f"Starter prompt is missing prompt text: {title}")
            continue
        if len(prompt.split()) < 6 or VAGUE_RE.search(prompt):
            failures.append(f"Starter prompt is too vague: {title}")
        intent = normalise_intent(f"{title} {prompt}")
        if intent in seen_intents:
            failures.append(f"Starter prompt duplicates intent with {seen_intents[intent]}: {title}")
        else:
            seen_intents[intent] = title

    if failures:
        print("Starter-prompt consistency validation failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("Starter-prompt consistency validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
