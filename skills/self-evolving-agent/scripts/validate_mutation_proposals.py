#!/usr/bin/env python3
"""Validate mutation proposal records for governed skill or agent evolution.

This helper is intentionally conservative. It validates JSON or JSONL proposal
records before review or application. It does not apply changes, mutate files,
call external services, or infer missing approval.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

REQUIRED_FIELDS = {
    "id",
    "type",
    "target",
    "problem",
    "change",
    "evidence_quality",
    "expected_benefit",
    "risk_level",
    "evaluation",
    "rollback",
    "verdict",
}

MUTATION_TYPES = {
    "trigger",
    "workflow",
    "output",
    "routing",
    "safety",
    "memory",
    "tooling",
    "reference",
    "cleanup",
    "evaluation",
    "packaging",
    "maintainability",
}

EVIDENCE_QUALITY = {"confirmed", "inferred", "unverified", "blocked"}
RISK_LEVELS = {"low", "medium", "high", "blocked"}
VERDICTS = {"accept", "revise", "hold", "reject"}
APPROVAL_LEVELS = {
    "proposal",
    "local_package",
    "connected_edit",
    "publication",
    "permission_change",
}


def load_records(path: Path) -> list[dict[str, Any]]:
    text = path.read_text(encoding="utf-8").strip()
    if not text:
        return []

    if path.suffix.lower() == ".jsonl":
        records: list[dict[str, Any]] = []
        for line_number, line in enumerate(text.splitlines(), start=1):
            if not line.strip():
                continue
            try:
                value = json.loads(line)
            except json.JSONDecodeError as exc:
                raise ValueError(f"line {line_number}: invalid JSON: {exc}") from exc
            if not isinstance(value, dict):
                raise ValueError(f"line {line_number}: record must be a JSON object")
            records.append(value)
        return records

    try:
        value = json.loads(text)
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON: {exc}") from exc

    if isinstance(value, dict):
        return [value]
    if isinstance(value, list) and all(isinstance(item, dict) for item in value):
        return value
    raise ValueError("input must be a JSON object, JSON array of objects, or JSONL objects")


def is_non_empty_string(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def validate_record(record: dict[str, Any], index: int) -> list[str]:
    errors: list[str] = []
    prefix = f"record {index}"

    missing = sorted(REQUIRED_FIELDS - set(record))
    if missing:
        errors.append(f"{prefix}: missing required field(s): {', '.join(missing)}")

    for field in REQUIRED_FIELDS - {"evaluation"}:
        if field in record and not is_non_empty_string(record[field]):
            errors.append(f"{prefix}: `{field}` must be a non-empty string")

    mutation_type = record.get("type")
    if is_non_empty_string(mutation_type) and mutation_type not in MUTATION_TYPES:
        errors.append(f"{prefix}: invalid type `{mutation_type}`")

    evidence_quality = record.get("evidence_quality")
    if is_non_empty_string(evidence_quality) and evidence_quality not in EVIDENCE_QUALITY:
        errors.append(f"{prefix}: invalid evidence_quality `{evidence_quality}`")

    risk_level = record.get("risk_level")
    if is_non_empty_string(risk_level) and risk_level not in RISK_LEVELS:
        errors.append(f"{prefix}: invalid risk_level `{risk_level}`")

    verdict = record.get("verdict")
    if is_non_empty_string(verdict) and verdict not in VERDICTS:
        errors.append(f"{prefix}: invalid verdict `{verdict}`")

    approval_level = record.get("approval_level")
    if approval_level is not None and approval_level not in APPROVAL_LEVELS:
        errors.append(f"{prefix}: invalid approval_level `{approval_level}`")

    evaluation = record.get("evaluation")
    if "evaluation" in record:
        if isinstance(evaluation, str):
            if not evaluation.strip():
                errors.append(f"{prefix}: `evaluation` string must not be empty")
        elif isinstance(evaluation, dict):
            method = evaluation.get("method")
            if not is_non_empty_string(method):
                errors.append(f"{prefix}: evaluation object must include non-empty `method`")
        else:
            errors.append(f"{prefix}: `evaluation` must be a string or object")

    dependencies = record.get("dependencies")
    if dependencies is not None:
        if not isinstance(dependencies, list) or not all(is_non_empty_string(item) for item in dependencies):
            errors.append(f"{prefix}: `dependencies` must be a list of non-empty strings")

    regression_checks = record.get("regression_checks")
    if regression_checks is not None:
        if not isinstance(regression_checks, list) or not all(is_non_empty_string(item) for item in regression_checks):
            errors.append(f"{prefix}: `regression_checks` must be a list of non-empty strings")

    if evidence_quality == "blocked" and verdict == "accept":
        errors.append(f"{prefix}: blocked evidence cannot have verdict `accept`")
    if risk_level == "blocked" and verdict == "accept":
        errors.append(f"{prefix}: blocked risk cannot have verdict `accept`")

    return errors


def validate_records(records: list[dict[str, Any]]) -> list[str]:
    errors: list[str] = []
    seen_ids: set[str] = set()

    if not records:
        return ["no proposal records found"]

    for index, record in enumerate(records, start=1):
        record_id = record.get("id")
        if is_non_empty_string(record_id):
            if record_id in seen_ids:
                errors.append(f"record {index}: duplicate id `{record_id}`")
            seen_ids.add(record_id)
        errors.extend(validate_record(record, index))

    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate mutation proposal JSON or JSONL records.")
    parser.add_argument("--input", required=True, help="Path to proposal JSON or JSONL file.")
    args = parser.parse_args()

    input_path = Path(args.input)
    if not input_path.exists() or not input_path.is_file():
        raise SystemExit(f"input file not found: {input_path}")

    try:
        records = load_records(input_path)
    except ValueError as exc:
        raise SystemExit(f"ERROR: {exc}") from exc

    errors = validate_records(records)
    print(f"validated_records: {len(records)}")
    print(f"errors: {len(errors)}")
    for error in errors:
        print(f"ERROR: {error}")

    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
