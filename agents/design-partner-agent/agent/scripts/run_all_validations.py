#!/usr/bin/env python3
"""Run the current validation suite for this agent.

The runner distinguishes three outcomes for each step:
- PASS: validator ran and returned success
- FAIL: validator ran and returned a non-zero status
- SKIP: validator or required input was not available in the current workspace
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(".")
PYTHON = sys.executable

VALIDATION_STEPS = [
    {"name": "markdown folders", "command": [PYTHON, "scripts/validate_markdown_folders.py", "tests", "templates", "examples", "memory"], "required_files": ["scripts/validate_markdown_folders.py"]},
    {"name": "schema validation", "command": [PYTHON, "scripts/validate_schemas.py"], "required_files": ["scripts/validate_schemas.py"]},
    {"name": "cross-file consistency", "command": [PYTHON, "scripts/validate_cross_file_consistency.py"], "required_files": ["scripts/validate_cross_file_consistency.py"]},
    {"name": "memory hygiene", "command": [PYTHON, "scripts/validate_memory_hygiene.py"], "required_files": ["scripts/validate_memory_hygiene.py"]},
    {"name": "workflow coverage", "command": [PYTHON, "scripts/validate_workflow_coverage.py"], "required_files": ["scripts/validate_workflow_coverage.py"]},
    {"name": "reference-site-analysis outputs", "command": [PYTHON, "scripts/validate_reference_site_analysis_outputs.py"], "required_files": ["scripts/validate_reference_site_analysis_outputs.py", "templates/reference-site-analysis-template.md", "examples/reference-site-analysis-example.md", "schemas/reference-site-analysis.schema.json"], "optional_files": ["tests/reference-site-analysis-quality-check.md"]},
    {"name": "template/schema alignment", "command": [PYTHON, "scripts/validate_template_schema_alignment.py"], "required_files": ["scripts/validate_template_schema_alignment.py"]},
    {"name": "business context completeness", "command": [PYTHON, "scripts/validate_business_context.py"], "required_files": ["scripts/validate_business_context.py", "business-context.md"]},
    {"name": "instruction file references", "command": [PYTHON, "scripts/validate_instruction_references.py", "agent_instructions.txt", "--agent-files-root", "."], "required_files": ["scripts/validate_instruction_references.py", "agent_instructions.txt"]},
    {"name": "app usage consistency", "command": [PYTHON, "scripts/validate_app_usage_consistency.py", "agent_instructions.txt", "--allowed-app", "Figma", "--allowed-app", "Google Drive", "--allowed-app", "Linear", "--allowed-app", "GitHub", "--allowed-app", "Gmail"], "required_files": ["scripts/validate_app_usage_consistency.py", "agent_instructions.txt"]},
    {"name": "source-priority consistency", "command": [PYTHON, "scripts/validate_source_priority_consistency.py"], "required_files": ["scripts/validate_source_priority_consistency.py", "business-context.md", "references/CONNECTORS.md"], "optional_files": ["agent_instructions.txt"]},
    {"name": "links and references", "command": [PYTHON, "scripts/validate_links_and_references.py"], "required_files": ["scripts/validate_links_and_references.py"]},
    {"name": "starter prompts", "command": [PYTHON, "scripts/validate_starter_prompts.py", "starter-prompts.json"], "required_files": ["scripts/validate_starter_prompts.py"], "optional_files": ["starter-prompts.json"]},
]


def missing_required_files(files: list[str]) -> list[str]:
    return [path for path in files if not (ROOT / path).exists()]


def missing_optional_files(files: list[str]) -> list[str]:
    return [path for path in files if not (ROOT / path).exists()]


def main() -> int:
    failures = 0
    skips = 0
    for step in VALIDATION_STEPS:
        required_missing = missing_required_files(step.get("required_files", []))
        optional_missing = missing_optional_files(step.get("optional_files", []))
        if required_missing:
            skips += 1
            print(f"\n>>> SKIP: {step['name']}")
            for path in required_missing:
                print(f"    missing required input: {path}")
            continue
        print(f"\n>>> RUN: {step['name']}")
        if optional_missing:
            for path in optional_missing:
                print(f"    optional input not staged: {path}")
        print("    " + " ".join(step["command"]))
        result = subprocess.run(step["command"], cwd=ROOT)
        if result.returncode != 0:
            failures += 1
            print(f"    result: FAIL ({result.returncode})")
        else:
            print("    result: PASS")
    if failures:
        print(f"\nValidation runner finished with {failures} failing step(s) and {skips} skipped step(s).")
        return 1
    print(f"\nValidation runner finished successfully with {skips} skipped step(s).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
