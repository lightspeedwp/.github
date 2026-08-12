#!/usr/bin/env python3
"""Validate exported starter prompts for basic quality rules."""

from __future__ import annotations

import json
import sys
from pathlib import Path


def main() -> int:
    if len(sys.argv) != 2:
        print("[FAIL] usage: validate_starter_prompts.py <starter-prompts.json>")
        return 1

    path = Path(sys.argv[1])
    if not path.exists():
        print(f"[FAIL] starter prompts file not found: {path}")
        return 1

    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"[FAIL] could not parse {path}: {exc}")
        return 1

    prompts = data if isinstance(data, list) else data.get("starter_prompts", [])
    issues: list[str] = []
    for idx, item in enumerate(prompts, start=1):
        title = str(item.get("title", ""))
        short_description = str(item.get("short_description", ""))
        prompt = str(item.get("prompt", ""))
        if not title or len(title) > 32:
            issues.append(f"starter prompt {idx} has missing or oversized title")
        if not short_description or len(short_description) > 64:
            issues.append(f"starter prompt {idx} has missing or oversized short description")
        if not prompt or len(prompt) < 20:
            issues.append(f"starter prompt {idx} prompt text is too short")

    if issues:
        for issue in issues:
            print(f"[FAIL] {issue}")
        print(f"\nStarter prompt validation failed with {len(issues)} issue(s).")
        return 1

    print("Starter prompt validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
