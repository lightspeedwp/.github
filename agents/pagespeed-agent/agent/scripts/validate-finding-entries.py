"""Validate normalized finding entries from a YAML list."""

from pathlib import Path
import sys
import yaml

REQUIRED_KEYS = ["symptom", "why_it_matters", "evidence", "priority"]
ALLOWED_PRIORITIES = {"high", "medium", "low"}
ALLOWED_EFFORT = {"low", "medium", "high"}


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: python scripts/validate-finding-entries.py <path-to-yaml>")
        return 1

    path = Path(sys.argv[1])
    if not path.exists():
        print(f"Missing file: {path}")
        return 1

    data = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        print("Finding entries must be a list.")
        return 1

    errors = []
    for idx, entry in enumerate(data, start=1):
        if not isinstance(entry, dict):
            errors.append(f"entry #{idx} must be a mapping")
            continue
        for key in REQUIRED_KEYS:
            if key not in entry:
                errors.append(f"entry #{idx} missing '{key}'")
        if "priority" in entry and entry["priority"] not in ALLOWED_PRIORITIES:
            errors.append(f"entry #{idx} has invalid priority '{entry['priority']}'")
        if "estimated_effort" in entry and entry["estimated_effort"] not in ALLOWED_EFFORT:
            errors.append(f"entry #{idx} has invalid estimated_effort '{entry['estimated_effort']}'")

    if errors:
        print("Finding entry validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print("Finding entries look valid.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
