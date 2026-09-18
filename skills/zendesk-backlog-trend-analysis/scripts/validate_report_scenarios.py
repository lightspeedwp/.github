#!/usr/bin/env python3
"""Validate shared-agent report scenario fixtures.

This optional QA helper checks that synthetic smoke-test scenarios include the
behaviour expectations needed to test the skill safely in a shared agent. It has
no network dependency and does not inspect live Zendesk data.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any

REQUIRED_TOP_LEVEL = {"version", "purpose", "scenarios"}
REQUIRED_SCENARIO_KEYS = {
    "id",
    "prompt",
    "expected_report_type",
    "required_evidence",
    "required_behaviours",
    "forbidden_behaviours",
}
ALLOWED_REPORT_TYPES = {
    "backlog_health",
    "weekly_report",
    "trend_comparison",
    "daily_digest",
    "repeated_theme_review",
    "queue_risk_check",
    "mixed_operational_report",
    "permission_limited_response",
    "follow_on_routing",
}
REQUIRED_SHARED_AGENT_CONCEPTS = [
    "evidence",
    "SLA",
    "support-owned",
]
FORBIDDEN_PROMPT_TERMS = [
    re.compile(r"my private view", re.IGNORECASE),
    re.compile(r"ash", re.IGNORECASE),
    re.compile(re.escape("/mnt" + "/data"), re.IGNORECASE),
    re.compile(re.escape("file_" + "000"), re.IGNORECASE),
]


def as_string_list(value: Any, label: str, scenario_id: str) -> list[str]:
    if not isinstance(value, list) or not all(isinstance(item, str) and item.strip() for item in value):
        raise ValueError(f"{scenario_id}: {label} must be a non-empty list of strings")
    return value


def validate_scenario(scenario: Any, index: int) -> list[str]:
    errors: list[str] = []
    if not isinstance(scenario, dict):
        return [f"scenario {index}: must be an object"]

    scenario_id = str(scenario.get("id", f"scenario {index}"))
    missing = REQUIRED_SCENARIO_KEYS - set(scenario)
    if missing:
        errors.append(f"{scenario_id}: missing keys: {sorted(missing)}")

    extra = set(scenario) - REQUIRED_SCENARIO_KEYS
    if extra:
        errors.append(f"{scenario_id}: unexpected keys: {sorted(extra)}")

    if scenario.get("expected_report_type") not in ALLOWED_REPORT_TYPES:
        errors.append(f"{scenario_id}: invalid expected_report_type: {scenario.get('expected_report_type')!r}")

    prompt = scenario.get("prompt", "")
    if not isinstance(prompt, str) or not prompt.strip():
        errors.append(f"{scenario_id}: prompt must be a non-empty string")
    else:
        for pattern in FORBIDDEN_PROMPT_TERMS:
            if pattern.search(prompt):
                errors.append(f"{scenario_id}: prompt contains non-portable term matching {pattern.pattern!r}")

    for key in ["required_evidence", "required_behaviours", "forbidden_behaviours"]:
        try:
            as_string_list(scenario.get(key), key, scenario_id)
        except ValueError as exc:
            errors.append(str(exc))

    searchable = " ".join(
        str(item)
        for key in ["required_evidence", "required_behaviours", "forbidden_behaviours"]
        for item in scenario.get(key, [])
    )
    if "evidence" not in searchable.lower():
        errors.append(f"{scenario_id}: scenario should include evidence expectations")

    return errors


def validate_file(path: Path) -> list[str]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        return [f"{path.name}: invalid JSON: {exc}"]

    if not isinstance(data, dict):
        return [f"{path.name}: top-level JSON must be an object"]

    errors: list[str] = []
    missing = REQUIRED_TOP_LEVEL - set(data)
    if missing:
        errors.append(f"{path.name}: missing top-level keys: {sorted(missing)}")

    scenarios = data.get("scenarios")
    if not isinstance(scenarios, list) or not scenarios:
        errors.append(f"{path.name}: scenarios must be a non-empty list")
        return errors

    seen_ids: set[str] = set()
    all_behaviour_text = ""
    for index, scenario in enumerate(scenarios):
        errors.extend(validate_scenario(scenario, index))
        if isinstance(scenario, dict):
            scenario_id = scenario.get("id")
            if isinstance(scenario_id, str):
                if scenario_id in seen_ids:
                    errors.append(f"{path.name}: duplicate scenario id: {scenario_id}")
                seen_ids.add(scenario_id)
            all_behaviour_text += " " + " ".join(
                str(item)
                for key in ["required_evidence", "required_behaviours", "forbidden_behaviours"]
                for item in scenario.get(key, [])
            )

    lower_text = all_behaviour_text.lower()
    for concept in REQUIRED_SHARED_AGENT_CONCEPTS:
        if concept.lower() not in lower_text:
            errors.append(f"{path.name}: expected at least one scenario to cover {concept!r}")

    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate report scenario JSON files.")
    parser.add_argument("paths", nargs="*", type=Path, help="Scenario JSON files or directories. Defaults to ../evaluations.")
    args = parser.parse_args()

    script_dir = Path(__file__).resolve().parent
    default_dir = script_dir.parent / "evaluations"
    targets = args.paths or [default_dir]

    files: list[Path] = []
    for target in targets:
        if target.is_dir():
            files.extend(sorted(target.glob("*.json")))
        else:
            files.append(target)

    all_errors: list[str] = []
    for file_path in files:
        all_errors.extend(validate_file(file_path))

    if all_errors:
        for error in all_errors:
            print(f"ERROR: {error}")
        return 1

    print(f"Validated {len(files)} report scenario file(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
