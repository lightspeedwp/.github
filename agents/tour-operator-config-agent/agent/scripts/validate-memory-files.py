#!/usr/bin/env python3
"""Lightweight validator for memory folder structure and section discipline."""

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
MEMORY = ROOT / "memory"
REQUIRED = {
    "todos.md": ["#", "##"],
    "user-preferences.md": ["#", "##"],
    "project-history.md": ["#", "##"],
    "session-handoff.md": ["#", "##"],
}

if not MEMORY.exists():
    print("Memory validation skipped: memory/ is not present in the current attached file tree.")
    sys.exit(0)

errors = []
for name, markers in REQUIRED.items():
    path = MEMORY / name
    if not path.exists():
        errors.append(f"missing memory file: {name}")
        continue
    text = path.read_text(encoding="utf-8")
    for marker in markers:
        if marker not in text:
            errors.append(f"{name} is missing expected section markers")
            break

if errors:
    print("Memory validation failed:")
    for err in errors:
        print(f"- {err}")
    sys.exit(1)

print("Memory validation passed.")
