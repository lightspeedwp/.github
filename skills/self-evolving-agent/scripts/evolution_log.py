#!/usr/bin/env python3
"""Normalise raw self-evolution feedback notes into JSONL observations.

This helper is intentionally conservative. It does not mutate a skill or make
recommendations; it only converts notes into a structured log that ChatGPT can
review before proposing changes.
"""

from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

KEYWORDS = {
    "failure": ("fail", "broken", "bug", "wrong", "missed", "error", "regression"),
    "metric": ("score", "rate", "metric", "benchmark", "latency", "accuracy", "pass", "fail"),
    "decision": ("approved", "rejected", "accepted", "decided", "deferred", "blocked"),
    "request": ("please", "need", "should", "can you", "add", "remove", "change"),
    "safety": ("unsafe", "permission", "secret", "private", "approval", "sandbox", "redact"),
}


def classify(text: str) -> str:
    lowered = text.lower()
    for label, terms in KEYWORDS.items():
        if any(term in lowered for term in terms):
            return label
    return "note"


def paragraphs(text: str) -> Iterable[str]:
    current: list[str] = []
    for line in text.splitlines():
        stripped = line.strip()
        if stripped.startswith(("- ", "* ")):
            stripped = stripped[2:].strip()
        if not stripped:
            if current:
                yield " ".join(current).strip()
                current = []
            continue
        # Keep list items separate enough to remain traceable.
        if line.strip().startswith(("- ", "* ")) and current:
            yield " ".join(current).strip()
            current = [stripped.lstrip("#").strip()]
        else:
            current.append(stripped.lstrip("#").strip())
    if current:
        yield " ".join(current).strip()


def build_records(skill: str, source: Path, content: str) -> list[dict]:
    timestamp = datetime.now(timezone.utc).isoformat()
    records = []
    for index, item in enumerate(paragraphs(content), start=1):
        if not item:
            continue
        records.append(
            {
                "skill": skill,
                "source": str(source),
                "observation_id": f"obs-{index:04d}",
                "observation_type": classify(item),
                "evidence": item,
                "recorded_at": timestamp,
            }
        )
    return records


def main() -> int:
    parser = argparse.ArgumentParser(description="Normalise evolution feedback notes into JSONL.")
    parser.add_argument("--skill", required=True, help="Skill or agent name under review.")
    parser.add_argument("--source", required=True, help="Path to a plain-text or markdown feedback file.")
    parser.add_argument("--output", required=True, help="Path to write JSONL observations.")
    parser.add_argument("--append", action="store_true", help="Append instead of overwriting output.")
    args = parser.parse_args()

    source = Path(args.source)
    output = Path(args.output)

    if not source.exists() or not source.is_file():
        raise SystemExit(f"source file not found: {source}")

    content = source.read_text(encoding="utf-8")
    records = build_records(args.skill, source, content)

    output.parent.mkdir(parents=True, exist_ok=True)
    mode = "a" if args.append else "w"
    with output.open(mode, encoding="utf-8") as handle:
        for record in records:
            handle.write(json.dumps(record, ensure_ascii=False) + "\n")

    print(f"wrote {len(records)} observation(s) to {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
