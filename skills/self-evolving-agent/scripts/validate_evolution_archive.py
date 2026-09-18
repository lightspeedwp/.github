#!/usr/bin/env python3
"""Validate JSONL archive records for governed skill evolution.

The validator is intentionally narrow: it reads JSONL, checks required fields,
and reports missing or malformed records. It does not mutate files, call the
network, or make recommendations.
"""

from __future__ import annotations

import argparse
import json
from datetime import date
from pathlib import Path
from typing import Any

REQUIRED_FIELDS = {
    "version",
    "parent_version",
    "date",
    "owner",
    "mutation_type",
    "summary",
    "evidence",
    "evaluation",
    "verdict",
    "rollback",
}

VALID_VERDICTS = {"accepted", "revised", "held", "rejected"}
VALID_RISK_LEVELS = {"low", "medium", "high", "blocked"}


def _valid_date(value: str) -> bool:
    try:
        date.fromisoformat(value)
    except ValueError:
        return False
    return True


def validate_record(record: dict[str, Any], line_number: int) -> list[str]:
    errors: list[str] = []
    missing = sorted(REQUIRED_FIELDS - record.keys())
    if missing:
        errors.append(f"line {line_number}: missing required field(s): {', '.join(missing)}")

    if "date" in record and not isinstance(record["date"], str):
        errors.append(f"line {line_number}: date must be a string")
    elif "date" in record and not _valid_date(record["date"]):
        errors.append(f"line {line_number}: date must be ISO format YYYY-MM-DD")

    if "evidence" in record and not isinstance(record["evidence"], list):
        errors.append(f"line {line_number}: evidence must be a list")

    if "evaluation" in record and not isinstance(record["evaluation"], dict):
        errors.append(f"line {line_number}: evaluation must be an object")
    elif "evaluation" in record:
        for key in ("method", "result"):
            if key not in record["evaluation"]:
                errors.append(f"line {line_number}: evaluation.{key} is required")

    if "verdict" in record and record["verdict"] not in VALID_VERDICTS:
        errors.append(
            f"line {line_number}: verdict must be one of {', '.join(sorted(VALID_VERDICTS))}"
        )

    if "risk_level" in record and record["risk_level"] not in VALID_RISK_LEVELS:
        errors.append(
            f"line {line_number}: risk_level must be one of {', '.join(sorted(VALID_RISK_LEVELS))}"
        )

    for key in ("version", "parent_version", "owner", "mutation_type", "summary", "rollback"):
        if key in record and not isinstance(record[key], str):
            errors.append(f"line {line_number}: {key} must be a string")
        elif key in record and not record[key].strip():
            errors.append(f"line {line_number}: {key} must not be empty")

    return errors


def validate_file(path: Path) -> tuple[int, list[str]]:
    errors: list[str] = []
    count = 0

    if not path.exists() or not path.is_file():
        return 0, [f"input file not found: {path}"]

    with path.open("r", encoding="utf-8") as handle:
        for line_number, line in enumerate(handle, start=1):
            stripped = line.strip()
            if not stripped:
                continue
            count += 1
            try:
                record = json.loads(stripped)
            except json.JSONDecodeError as exc:
                errors.append(f"line {line_number}: invalid JSON: {exc.msg}")
                continue
            if not isinstance(record, dict):
                errors.append(f"line {line_number}: record must be a JSON object")
                continue
            errors.extend(validate_record(record, line_number))

    if count == 0:
        errors.append("input file contains no JSONL records")

    return count, errors


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate governed evolution archive JSONL records.")
    parser.add_argument("--input", required=True, help="Path to a JSONL archive file.")
    args = parser.parse_args()

    count, errors = validate_file(Path(args.input))
    if errors:
        print(f"validated {count} record(s); found {len(errors)} error(s)")
        for error in errors:
            print(f"- {error}")
        return 1

    print(f"validated {count} archive record(s); no errors found")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
