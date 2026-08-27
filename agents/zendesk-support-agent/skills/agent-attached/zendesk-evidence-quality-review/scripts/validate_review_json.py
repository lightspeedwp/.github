#!/usr/bin/env python3
"""Validate a structured Zendesk evidence-quality review JSON file.

This script is intentionally dependency-light for shared-agent portability. It
uses jsonschema when available, then falls back to a small JSON Schema subset
validator that supports the schema features used by review-result.schema.json.

Usage:
  python scripts/validate_review_json.py path/to/review.json
  python scripts/validate_review_json.py path/to/review.json --schema schemas/review-result.schema.json
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Iterable


def load_json(path: Path) -> Any:
    try:
        with path.open("r", encoding="utf-8") as handle:
            return json.load(handle)
    except FileNotFoundError:
        raise ValueError(f"File not found: {path}") from None
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid JSON in {path}: line {exc.lineno}, column {exc.colno}: {exc.msg}") from None


def type_matches(value: Any, expected_type: str) -> bool:
    if expected_type == "object":
        return isinstance(value, dict)
    if expected_type == "array":
        return isinstance(value, list)
    if expected_type == "string":
        return isinstance(value, str)
    if expected_type == "boolean":
        return isinstance(value, bool)
    if expected_type == "integer":
        return isinstance(value, int) and not isinstance(value, bool)
    if expected_type == "number":
        return (isinstance(value, int) or isinstance(value, float)) and not isinstance(value, bool)
    if expected_type == "null":
        return value is None
    return True


def validate_subset(value: Any, schema: dict[str, Any], path: str = "$") -> list[str]:
    errors: list[str] = []

    expected_type = schema.get("type")
    if isinstance(expected_type, str) and not type_matches(value, expected_type):
        return [f"{path}: expected {expected_type}, got {type(value).__name__}"]

    if "enum" in schema and value not in schema["enum"]:
        allowed = ", ".join(repr(item) for item in schema["enum"])
        errors.append(f"{path}: value {value!r} is not one of: {allowed}")

    if isinstance(value, dict):
        required = schema.get("required", [])
        for key in required:
            if key not in value:
                errors.append(f"{path}: missing required property {key!r}")

        properties = schema.get("properties", {})
        if schema.get("additionalProperties") is False:
            allowed_keys = set(properties.keys())
            for key in value.keys():
                if key not in allowed_keys:
                    errors.append(f"{path}: unexpected property {key!r}")

        for key, child_schema in properties.items():
            if key in value:
                errors.extend(validate_subset(value[key], child_schema, f"{path}.{key}"))

    if isinstance(value, list):
        item_schema = schema.get("items")
        if isinstance(item_schema, dict):
            for index, item in enumerate(value):
                errors.extend(validate_subset(item, item_schema, f"{path}[{index}]"))

    return errors


def validate_with_jsonschema(data: Any, schema: dict[str, Any]) -> list[str] | None:
    try:
        import jsonschema  # type: ignore
    except Exception:
        return None

    validator = jsonschema.Draft202012Validator(schema)
    errors = sorted(validator.iter_errors(data), key=lambda item: list(item.path))
    return [format_jsonschema_error(error) for error in errors]


def format_jsonschema_error(error: Any) -> str:
    location = "$"
    for part in error.path:
        if isinstance(part, int):
            location += f"[{part}]"
        else:
            location += f".{part}"
    return f"{location}: {error.message}"


def print_errors(errors: Iterable[str]) -> None:
    print("Review JSON is invalid:")
    for error in errors:
        print(f"- {error}")


def parse_args() -> argparse.Namespace:
    script_dir = Path(__file__).resolve().parent
    default_schema = script_dir.parent / "schemas" / "review-result.schema.json"

    parser = argparse.ArgumentParser(description="Validate structured review JSON output.")
    parser.add_argument("review_json", type=Path, help="Path to the review JSON file to validate.")
    parser.add_argument("--schema", type=Path, default=default_schema, help="Path to the review-result JSON schema.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    try:
        data = load_json(args.review_json)
        schema = load_json(args.schema)
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 2

    errors = validate_with_jsonschema(data, schema)
    if errors is None:
        errors = validate_subset(data, schema)

    if errors:
        print_errors(errors)
        return 1

    print("Review JSON is valid.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
