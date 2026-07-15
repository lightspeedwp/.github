#!/usr/bin/env python3
"""Run all optional local QA checks for the skill bundle."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path


def run(command: list[str]) -> int:
    print("$ " + " ".join(command))
    result = subprocess.run(command, check=False)
    return result.returncode


def main() -> int:
    root = Path(__file__).resolve().parent.parent
    scripts = root / "scripts"
    examples = root / "examples"

    commands: list[list[str]] = [
        [sys.executable, str(scripts / "validate_fixture_schema.py"), str(root / "fixtures")],
        [sys.executable, str(scripts / "validate_report_scenarios.py"), str(root / "evaluations")],
        [sys.executable, str(scripts / "validate_capability_profile.py"), str(root / "profiles" / "workspace-capability-profile-example.json")],
        [sys.executable, str(scripts / "lint_portability.py"), str(root)],
    ]

    for report_name in [
        "backlog-health-good.md",
        "weekly-report-good.md",
        "trend-comparison-good.md",
        "permission-limited-response.md",
    ]:
        commands.append([sys.executable, str(scripts / "check_report_structure.py"), str(examples / report_name)])

    failures = 0
    for command in commands:
        failures += 1 if run(command) != 0 else 0

    if failures:
        print(f"{failures} check(s) failed.")
        return 1

    print("All skill QA checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
