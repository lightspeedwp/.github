#!/usr/bin/env python3
"""Validate file references, path references, and file-entity tags in the current WordPress agent docs."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOC_GLOBS = [
    "business-context.md",
    "memory/*.md",
    "references/*.md",
    "templates/*.md",
    "examples/*.md",
    "schemas/README.md",
    "scripts/README.md",
    "tests/*.md",
]
PATH_RE = re.compile(
    r"((?:tests|scripts|templates|examples|schemas|memory|references)/[A-Za-z0-9._/-]+\.(?:md|json|sh|py|js))"
)
ENTITY_TAG_RE = re.compile(r"\{\{label:([^,}]+),id:([^,}]+),type:file\}\}")


def collect_docs() -> list[Path]:
    docs: list[Path] = []
    for pattern in DOC_GLOBS:
        docs.extend(sorted(ROOT.glob(pattern)))
    seen: set[Path] = set()
    unique_docs: list[Path] = []
    for path in docs:
        if path not in seen and path.is_file():
            unique_docs.append(path)
            seen.add(path)
    return unique_docs


def collect_agent_files() -> dict[str, Path]:
    files: dict[str, Path] = {}
    for path in ROOT.rglob("*"):
        if not path.is_file():
            continue
        relative = path.relative_to(ROOT)
        files[str(relative)] = path
        files[path.name] = path
    return files


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def main() -> int:
    failures: list[str] = []
    docs = collect_docs()
    known_files = collect_agent_files()

    for doc in docs:
        rel_doc = doc.relative_to(ROOT)
        text = read(doc)

        for match in PATH_RE.finditer(text):
            ref = match.group(1)
            if not (ROOT / ref).exists():
                failures.append(f"{rel_doc}: references missing path '{ref}'")

        for match in ENTITY_TAG_RE.finditer(text):
            label = match.group(1).strip()
            entity_id = match.group(2).strip()
            target = known_files.get(label)
            if target is None:
                failures.append(
                    f"{rel_doc}: file entity tag label '{label}' does not match a current file (entity id: {entity_id})"
                )

        if "memory/defaults/" in text or "memory/schemas/" in text or "intake/" in text:
            failures.append(
                f"{rel_doc}: references an outdated or unsupported folder path for the current structure"
            )

    if failures:
        print("Reference-link validation failed:")
        for failure in sorted(set(failures)):
            print(f"- {failure}")
        return 1

    print("Reference-link validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
